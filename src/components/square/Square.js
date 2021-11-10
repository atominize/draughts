const Square = (props) => {
  const bgColor =
    (props.row / 10) % 2 === props.col % 2 ? "square-brown" : "square-light";

  const highlight = props.highlightPos.includes(props.value)
    ? " square-highlight"
    : "";

  return (
    <button
      className={`square ${bgColor}${highlight}`}
      style={{ color: props.marble.color }}
      onClick={props.onClick}
    >
      {props.marble.marble}
    </button>
  );
};

export default Square;
