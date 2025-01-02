export default function ProfileLayout({ children }) {
  return (
    <div className="container px-4 py-8 max-w-[1080px] mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="grid grid-cols-1 gap-8 ">{children}</div>
    </div>
  );
}
