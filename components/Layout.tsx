import LeagueCards from "./LeagueCards";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="layout">
      <LeagueCards />
      <main>{children}</main>
    </div>
  );
}
