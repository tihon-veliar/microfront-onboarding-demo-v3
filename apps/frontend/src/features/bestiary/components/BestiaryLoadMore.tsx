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
    <button aria-label={ariaLabel || label} disabled={disabled} onClick={onClick} type="button">
      {loading ? "Loading..." : label}
    </button>
  );
};

export default BestiaryLoadMore;
