import Background from "./common/Background";

export default function Footer() {
  return (
    <footer className="bg-gray-100 p-4 text-center">
      <Background />
      © {new Date().getFullYear()} Alumni Connect
    </footer>
  );
}
