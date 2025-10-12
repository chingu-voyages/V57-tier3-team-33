import { PBLogo } from "../components/brand";
import GitHub from "../components/icons/github";
import { useAuth } from "../context/AuthContext";


export default function Auth() {
  const { loading, logIn, error } = useAuth();

  return (
    <main className="grid grid-cols-1 md:grid-cols-2">
      <div className="h-screen relative hidden md:block">
        <div className="absolute top-4 left-4">
          <PBLogo width={200} />
        </div>
        <img src="/pbImg.png" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4">
        <div className="flex flex-col justify-center items-center text-center">
          <div className="md:hidden mb-8">
            <PBLogo width={150} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Thanks for trying PullBoard</h2>
          <h3 className="text-lg text-gray-600 mb-8">Login to start tracking your pull requests</h3>
          <p className="text-gray-500">Sign in with your GitHub account</p>
          <button
            onClick={logIn}
            className="flex bg-black text-white py-3 px-8 items-center gap-3 rounded-lg w-fit mt-8 text-lg hover:bg-gray-800 transition-colors">
            <GitHub />
            <span className="">Sign in with GitHub {loading && "..."}</span>
          </button>
          {error && <p>{error}</p>}
        </div>
      </div>
    </main>
  );
}
