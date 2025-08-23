import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const ratingData = await request.json();
    
    // Validate rating data
    if (!ratingData.rating || typeof ratingData.rating !== 'number' || ratingData.rating < 1 || ratingData.rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }
    
    // Log to file
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `${timestamp} - RATING: User rated ${ratingData.rating} stars (source: ${ratingData.source || 'unknown'}, platform: ${ratingData.platform || 'unknown'})\n`;
    
    const logFilePath = join(process.cwd(), 'alchm_featuring.log');
    
    try {
      // Append to log file
      const existingContent = existsSync(logFilePath) ? readFileSync(logFilePath, 'utf8') : '';
      writeFileSync(logFilePath, existingContent + logEntry);
    } catch (fileError) {
      console.error('Error writing to log file:', fileError);
    }
    
    // In production, this would also save to Firestore
    console.log(`Rating logged: ${ratingData.rating} stars`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Rating logged successfully',
      rating: ratingData.rating
    });
    
  } catch (error) {
    console.error('Error logging rating:', error);
    return NextResponse.json({ error: 'Failed to log rating' }, { status: 500 });
  }
}