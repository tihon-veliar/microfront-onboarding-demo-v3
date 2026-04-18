type BestiaryLoadMoreProps = {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
};

const BestiaryLoadMore = ({ onClick, loading, disabled }: BestiaryLoadMoreProps) => {
  return (
    <button disabled={disabled} onClick={onClick} type="button">
      {loading ? "Loading..." : "Load more"}
    </button>
  );
};

export default BestiaryLoadMore;
