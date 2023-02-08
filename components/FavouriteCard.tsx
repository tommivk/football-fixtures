import Link from "next/link";

type Props = {
  active: boolean;
};

const FavouriteCard = ({ active }: Props) => {
  return (
    <Link
      className={`card favourite-card ${active ? "active" : ""}`}
      href={"/favourites"}
    >
      <img
        src={
          "https://upload.wikimedia.org/wikipedia/commons/9/99/Star_icon_stylized.svg"
        }
        width={50}
        height={50}
      />
      <h4>Favourites</h4>
    </Link>
  );
};

export default FavouriteCard;
