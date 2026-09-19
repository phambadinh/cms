function Badge({ children, tone = "default", className = "", ...props }) {
  const classes = ["mentor-badge", `badge-${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export default Badge;
