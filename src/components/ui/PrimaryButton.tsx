export default function PrimaryButton(props: JSX.IntrinsicElements["button"]) {
  const { className = "", ...rest } = props;
  
  return (
    <button
      className={`h-12 px-6 rounded-2xl bg-[var(--sage)] text-white font-medium
                  hover:opacity-95 focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[var(--terra)] disabled:opacity-30 disabled:pointer-events-none
                  transition-opacity duration-base ${className}`}
      {...rest}
    />
  );
}