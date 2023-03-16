import BlurContainer from "./BlurContainer";

interface Props {
  name: string;
}

const Chip: React.FC<Props> = ({ name }) => {
  return (
    <BlurContainer>
      <div className="p-2">{name}</div>
    </BlurContainer>
  );
};

export default Chip;
