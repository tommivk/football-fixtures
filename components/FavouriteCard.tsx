import Link from "next/link";

const FavouriteCard = () => {
  return (
    <Link className="card favourite-card" href={"/favourites"}>
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
