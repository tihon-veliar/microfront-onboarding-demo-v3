type BestiaryLoadMoreProps = {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  label?: string;
  ariaLabel?: string;
};

const BestiaryLoadMore = ({
  onClick,
  loading,
  disabled,
  label = "Load more",
  ariaLabel,
}: BestiaryLoadMoreProps) => {
  return (
    <button
      aria-label={ariaLabel || label}
      className="inline-flex min-h-11 items-center justify-center rounded-full  px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {loading ? "Loading..." : label}
    </button>
  );
};

export default BestiaryLoadMore;
