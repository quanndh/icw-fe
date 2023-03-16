interface Props {
  children: JSX.Element;
  className?: string;
  onClick?: () => void;
}

const BlurContainer: React.FC<Props> = ({ children, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={
        "backdrop-filter backdrop-blur-3xl w-fit h-fit rounded-lg drop-shadow-lg" +
        className
      }
    >
      {children}
    </div>
  );
};

export default BlurContainer;
