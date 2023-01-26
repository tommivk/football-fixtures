type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size: "sm" | "md";
  children: React.ReactNode;
  active?: boolean;
};

const Button = ({ children, active, size, ...props }: Props) => {
  return (
    <button
      {...props}
      className={`btn
                  ${props.className} 
                  ${size === "sm" ? "btn-sm" : ""} 
                  ${size === "md" ? "btn-md" : ""} 
                  ${active ? "active" : ""}
                `}
    >
      {children}
    </button>
  );
};

export default Button;
