// Community Healing Service for ALCHM
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { 
  CommunityStory, 
  HealingCircle, 
  WisdomEntry, 
  CollectiveExperience,
  CommunityModerationLog,
  PeerMatchProfile,
  AnonymousParticipant,
  CreateStoryRequest,
  CreateWisdomEntryRequest,
  JoinCircleRequest
} from "./communityTypes";
import { aiModerationCheck, generateAnonymousId } from "./utils/communityUtils";

const db = getFirestore();

export class CommunityHealingService {
  
  // === ANONYMOUS STORY SHARING ===
  async createStory(userId: string, storyData: CreateStoryRequest): Promise<string> {
    try {
      // Generate anonymous ID for this story
      const anonymousId = generateAnonymousId(userId, "story");
      
      // AI moderation check
      const moderationResult = await aiModerationCheck(storyData.content, "story");
      
      const story: Partial<CommunityStory> = {
        anonymousId,
        content: storyData.content,
        title: storyData.title,
        healingStage: storyData.healingStage as any,
        wisdomTags: storyData.wisdomTags,
        contentModerationStatus: moderationResult.isApproved ? "approved" : "flagged",
        moderationScore: moderationResult.score,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        reactions: {
          resonance: 0,
          gratitude: 0,
          strength: 0,
          solidarity: 0
        },
        reportCount: 0,
        location: storyData.location
      };

      const docRef = await db.collection("communityStories").add(story);
      
      // Log moderation action
      await this.logModerationAction({
        contentType: "story",
        contentId: docRef.id,
        action: story.contentModerationStatus === "approved" ? "approved" : "flagged",
        aiModerationScore: moderationResult.score,
        humanReviewRequired: !moderationResult.isApproved,
        timestamp: Timestamp.now()
      });

      // If flagged for crisis content, escalate
      if (moderationResult.crisisIndicators) {
        await this.handleCrisisEscalation(userId, docRef.id, "story", moderationResult.crisisLevel);
      }

      return docRef.id;
    } catch (error) {
      console.error("Error creating community story:", error);
      throw new Error("Failed to create community story");
    }
  }

  async getStoriesByHealingStage(stage: string, limit: number = 10): Promise<CommunityStory[]> {
    try {
      const snapshot = await db.collection("communityStories")
        .where("healingStage", "==", stage)
        .where("contentModerationStatus", "==", "approved")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityStory));
    } catch (error) {
      console.error("Error fetching stories by healing stage:", error);
      throw new Error("Failed to fetch stories");
    }
  }

  async addStoryReaction(userId: string, storyId: string, reactionType: string): Promise<void> {
    try {
      const anonymousUserId = generateAnonymousId(userId, "reaction");
      const batch = db.batch();
      
      // Check if user already reacted to prevent duplicate reactions
      const existingReaction = await db.collection("storyReactions")
        .where("storyId", "==", storyId)
        .where("anonymousUserId", "==", anonymousUserId)
        .where("reactionType", "==", reactionType)
        .limit(1)
        .get();

      if (!existingReaction.empty) {
        return; // User already reacted with this type
      }

      // Add reaction document
      const reactionRef = db.collection("storyReactions").doc();
      batch.set(reactionRef, {
        storyId,
        anonymousUserId,
        reactionType,
        createdAt: Timestamp.now()
      });

      // Increment reaction count on story
      const storyRef = db.collection("communityStories").doc(storyId);
      batch.update(storyRef, {
        [`reactions.${reactionType}`]: FieldValue.increment(1)
      });

      await batch.commit();
    } catch (error) {
      console.error("Error adding story reaction:", error);
      throw new Error("Failed to add reaction");
    }
  }

  // === HEALING CIRCLES ===
  async createHealingCircle(facilitatorId: string, circleData: Partial<HealingCircle>): Promise<string> {
    try {
      const circle: Partial<HealingCircle> = {
        ...circleData,
        facilitatorId,
        isActive: true,
        currentCapacity: 0,
        participants: [],
        sessions: [],
        createdAt: Timestamp.now(),
        lastActivityAt: Timestamp.now()
      };

      const docRef = await db.collection("healingCircles").add(circle);
      return docRef.id;
    } catch (error) {
      console.error("Error creating healing circle:", error);
      throw new Error("Failed to create healing circle");
    }
  }

  async joinHealingCircle(userId: string, circleId: string, _joinData: JoinCircleRequest): Promise<void> {
    try {
      void _joinData;
      const circleRef = db.collection("healingCircles").doc(circleId);
      const circle = await circleRef.get();
      
      if (!circle.exists) {
        throw new Error("Healing circle not found");
      }

      const circleData = circle.data() as HealingCircle;
      
      if (circleData.currentCapacity >= circleData.maxCapacity) {
        throw new Error("Healing circle is at capacity");
      }

      const anonymousId = generateAnonymousId(userId, `circle_${circleId}`);
      
      const participant: AnonymousParticipant = {
        anonymousId,
        joinedAt: Timestamp.now(),
        role: "participant",
        isActive: true
      };

      await circleRef.update({
        participants: FieldValue.arrayUnion(participant),
        currentCapacity: FieldValue.increment(1),
        lastActivityAt: Timestamp.now()
      });

    } catch (error) {
      console.error("Error joining healing circle:", error);
      throw new Error("Failed to join healing circle");
    }
  }

  async getActiveHealingCircles(topic?: string): Promise<HealingCircle[]> {
    try {
      let query = db.collection("healingCircles")
        .where("isActive", "==", true)
        .where("isPublic", "==", true);

      if (topic) {
        query = query.where("topic", "==", topic);
      }

      const snapshot = await query.orderBy("lastActivityAt", "desc").get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealingCircle));
    } catch (error) {
      console.error("Error fetching healing circles:", error);
      throw new Error("Failed to fetch healing circles");
    }
  }

  // === COMMUNITY WISDOM LIBRARY ===
  async createWisdomEntry(userId: string, wisdomData: CreateWisdomEntryRequest): Promise<string> {
    try {
      const anonymousId = generateAnonymousId(userId, "wisdom");
      
      // AI moderation for wisdom content
      const moderationResult = await aiModerationCheck(wisdomData.content, "wisdom");
      
      const wisdom: Partial<WisdomEntry> = {
        contributorAnonymousId: anonymousId,
        type: wisdomData.type as any,
        title: wisdomData.title,
        content: wisdomData.content,
        category: wisdomData.category,
        tags: wisdomData.tags,
        isVerified: false,
        effectiveness_votes: {
          helpful: 0,
          somewhat_helpful: 0,
          not_helpful: 0
        },
        createdAt: Timestamp.now(),
        lastUpdatedAt: Timestamp.now(),
        reportCount: 0,
        sourceType: wisdomData.sourceType as any
      };

      const docRef = await db.collection("communityWisdom").add(wisdom);
      
      await this.logModerationAction({
        contentType: "wisdom_entry",
        contentId: docRef.id,
        action: "approved",
        aiModerationScore: moderationResult.score,
        humanReviewRequired: moderationResult.score < 0.8,
        timestamp: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating wisdom entry:", error);
      throw new Error("Failed to create wisdom entry");
    }
  }

  async searchWisdomEntries(query: string, category?: string, tags?: string[]): Promise<WisdomEntry[]> {
    try {
      let firestoreQuery: any = db.collection("communityWisdom");

      if (category) {
        firestoreQuery = firestoreQuery.where("category", "==", category);
      }

      if (tags && tags.length > 0) {
        firestoreQuery = firestoreQuery.where("tags", "array-contains-any", tags);
      }

      const snapshot = await firestoreQuery
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();

      let results = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as WisdomEntry));

      // Simple text search if query provided
      if (query) {
        const searchTerms = query.toLowerCase().split(" ");
        results = results.filter((entry: WisdomEntry) => 
          searchTerms.some((term: string) => 
            entry.title.toLowerCase().includes(term) || 
            entry.content.toLowerCase().includes(term) ||
            entry.tags.some((tag: string) => tag.toLowerCase().includes(term))
          )
        );
      }

      return results;
    } catch (error) {
      console.error("Error searching wisdom entries:", error);
      throw new Error("Failed to search wisdom entries");
    }
  }

  async voteOnWisdomEntry(userId: string, entryId: string, vote: "helpful" | "somewhat_helpful" | "not_helpful"): Promise<void> {
    try {
      const anonymousUserId = generateAnonymousId(userId, "vote");
      const batch = db.batch();

      // Check for existing vote
      const existingVote = await db.collection("wisdomVotes")
        .where("entryId", "==", entryId)
        .where("voterAnonymousId", "==", anonymousUserId)
        .limit(1)
        .get();

      if (!existingVote.empty) {
        // Update existing vote
        const voteDoc = existingVote.docs[0];
        const oldVote = voteDoc.data().vote;
        
        batch.update(voteDoc.ref, { vote, createdAt: Timestamp.now() });
        
        // Update counters
        const entryRef = db.collection("communityWisdom").doc(entryId);
        batch.update(entryRef, {
          [`effectiveness_votes.${oldVote}`]: FieldValue.increment(-1),
          [`effectiveness_votes.${vote}`]: FieldValue.increment(1)
        });
      } else {
        // Create new vote
        const voteRef = db.collection("wisdomVotes").doc();
        batch.set(voteRef, {
          entryId,
          voterAnonymousId: anonymousUserId,
          vote,
          createdAt: Timestamp.now()
        });

        // Increment counter
        const entryRef = db.collection("communityWisdom").doc(entryId);
        batch.update(entryRef, {
          [`effectiveness_votes.${vote}`]: FieldValue.increment(1)
        });
      }

      await batch.commit();
    } catch (error) {
      console.error("Error voting on wisdom entry:", error);
      throw new Error("Failed to vote on wisdom entry");
    }
  }

  // === COLLECTIVE HEALING EXPERIENCES ===
  async createCollectiveExperience(facilitatorId: string, experienceData: any): Promise<string> {
    try {
      const experience: Partial<CollectiveExperience> = {
        name: experienceData.name,
        description: experienceData.description,
        type: experienceData.type,
        startDate: experienceData.startDate,
        endDate: experienceData.endDate,
        isActive: true,
        participantCount: 0,
        anonymousParticipants: [],
        prompts: experienceData.prompts.map((prompt: any, index: number) => ({
          id: `prompt_${index}`,
          experienceId: "", // Will be set after document creation
          ...prompt,
          responses: []
        })),
        createdAt: Timestamp.now(),
        facilitatorId
      };

      const docRef = await db.collection("collectiveExperiences").add(experience);
      
      // Update prompts with experience ID
      await docRef.update({
        "prompts": experience.prompts?.map(prompt => ({
          ...prompt,
          experienceId: docRef.id
        }))
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating collective experience:", error);
      throw new Error("Failed to create collective experience");
    }
  }

  async joinCollectiveExperience(userId: string, experienceId: string): Promise<void> {
    try {
      const anonymousId = generateAnonymousId(userId, `experience_${experienceId}`);
      
      const experienceRef = db.collection("collectiveExperiences").doc(experienceId);
      await experienceRef.update({
        anonymousParticipants: FieldValue.arrayUnion(anonymousId),
        participantCount: FieldValue.increment(1)
      });
    } catch (error) {
      console.error("Error joining collective experience:", error);
      throw new Error("Failed to join collective experience");
    }
  }

  // === PEER MATCHING ===
  async createPeerMatchProfile(userId: string, profileData: any): Promise<void> {
    try {
      const anonymousId = generateAnonymousId(userId, "peer_profile");
      
      const profile: Partial<PeerMatchProfile> = {
        anonymousId,
        healingTopics: profileData.healingTopics,
        healingStage: profileData.healingStage,
        supportType: profileData.supportType,
        communicationStyle: profileData.communicationStyle,
        timeZone: profileData.timeZone,
        availability: profileData.availability,
        experienceWith: profileData.experienceWith,
        isActive: true,
        createdAt: Timestamp.now(),
        lastActiveAt: Timestamp.now()
      };

      await db.collection("peerMatchProfiles").doc(anonymousId).set(profile);
    } catch (error) {
      console.error("Error creating peer match profile:", error);
      throw new Error("Failed to create peer match profile");
    }
  }

  // === SAFETY & MODERATION ===
  async reportContent(userId: string, contentId: string, contentType: string, reason: string, description?: string): Promise<void> {
    try {
      const reporterAnonymousId = generateAnonymousId(userId, "report");
      
      const report = {
        contentId,
        contentType,
        reporterAnonymousId,
        reason,
        description,
        createdAt: Timestamp.now(),
        status: "pending"
      };

      await db.collection("contentReports").add(report);

      // Increment report count on content
      const contentCollection = this.getContentCollectionName(contentType);
      await db.collection(contentCollection).doc(contentId).update({
        reportCount: FieldValue.increment(1)
      });

      // Auto-flag content if report threshold reached
      const contentDoc = await db.collection(contentCollection).doc(contentId).get();
      const contentData = contentDoc.data();
      
      if (contentData && contentData.reportCount >= 3) {
        await this.flagContentForReview(contentId, contentType, "multiple_reports");
      }
    } catch (error) {
      console.error("Error reporting content:", error);
      throw new Error("Failed to report content");
    }
  }

  private async logModerationAction(logData: Partial<CommunityModerationLog>): Promise<void> {
    try {
      await db.collection("communityModerationLogs").add(logData);
    } catch (error) {
      console.error("Error logging moderation action:", error);
    }
  }

  private async handleCrisisEscalation(userId: string, contentId: string, contentType: string, crisisLevel?: string): Promise<void> {
    try {
      // Create crisis alert
      await db.collection("crisisAlerts").add({
        userId,
        contentId,
        contentType,
        crisisLevel: crisisLevel || "medium",
        timestamp: Timestamp.now(),
        status: "active"
      });

      // Log escalation
      await this.logModerationAction({
        contentType: contentType as any,
        contentId,
        action: "escalated",
        escalationLevel: (crisisLevel as any) || "medium",
        timestamp: Timestamp.now(),
        humanReviewRequired: true
      });
    } catch (error) {
      console.error("Error handling crisis escalation:", error);
    }
  }

  private async flagContentForReview(contentId: string, contentType: string, reason: string): Promise<void> {
    try {
      const contentCollection = this.getContentCollectionName(contentType);
      await db.collection(contentCollection).doc(contentId).update({
        contentModerationStatus: "flagged"
      });

      await this.logModerationAction({
        contentType: contentType as any,
        contentId,
        action: "flagged",
        reason,
        timestamp: Timestamp.now(),
        humanReviewRequired: true
      });
    } catch (error) {
      console.error("Error flagging content for review:", error);
    }
  }

  private getContentCollectionName(contentType: string): string {
    const mapping: { [key: string]: string } = {
      "story": "communityStories",
      "wisdom_entry": "communityWisdom",
      "contribution": "healingSessions",
      "response": "collectiveExperiences"
    };
    return mapping[contentType] || "unknown";
  }
}
