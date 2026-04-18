type BestiaryLoadMoreProps = {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  label?: string;
};

const BestiaryLoadMore = ({
  onClick,
  loading,
  disabled,
  label = "Load more",
}: BestiaryLoadMoreProps) => {
  return (
    <button disabled={disabled} onClick={onClick} type="button">
      {loading ? "Loading..." : label}
    </button>
  );
};

export default BestiaryLoadMore;
