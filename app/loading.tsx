export default function Loading() {
  return (
    <div
      className="display-1 spinner-border"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      Loading...{" "}
    </div>
  );
}
