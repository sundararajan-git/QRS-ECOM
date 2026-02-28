const Spinner = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="h-full min-h-[60vh] w-full flex flex-col items-center justify-center gap-3">
      <div className="size-8 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
};

export default Spinner;
