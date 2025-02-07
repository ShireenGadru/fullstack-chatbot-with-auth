import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileImage } from "../../redux/userSlice";
import { Logo } from "../../components/Logo";
import { RootState } from "../../redux/store";
import defaultImage from "../../assets/user.png";
import { updateImage } from "../../api/userAuth";

export const UpdateImage = () => {
  const [error, setError] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user?.userData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!selectedImageFile) {
        console.error("No file selected");
        setError("No file selected");
        return;
      }
      const imageData = new FormData(); // Renamed to avoid shadowing
      imageData.append("profileImage", selectedImageFile);

      const response = await updateImage(imageData);

      const updatedProfileImage = response?.data?.data?.updatedUrl;
      dispatch(updateProfileImage(updatedProfileImage));
      navigate("/chat");
    } catch (error) {
      console.log(error);
      setError((error as Error)?.message || "invalid image");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setSelectedImageFile(file);
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full w-full">
      <div className="m-5">
        <Logo />
      </div>

      <div className="flex justify-center flex-col items-center h-full ">
        {" "}
        <div className="w-[460px] flex flex-col items-center justify-center bg-[#AAA9A9]/5 backdrop-blur-xs shadow-2xl  py-[70px] border-2 border-white/10 rounded-3xl">
          <h1 className="text-3xl font-bold mb-4">Change Profile Image</h1>
          <div>
            <img
              src={selectedImage ?? user?.profileImage ?? defaultImage}
              alt=""
              className="rounded-full w-36 h-36"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative w-full">
              <input
                type="file"
                id="fileUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <label
                htmlFor="fileUpload"
                className="mt-7 w-full flex items-center justify-center py-3 px-4 bg-gray-800 text-white rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 border border-gray-700 hover:border-transparent"
              >
                Choose Image
              </label>
            </div>
            <p className="text-center mt-2">{error}</p>
            <button
              className="cursor-pointer w-[360px] mt-6 mb-3  py-1.5 text-white font-semibold rounded-md bg-gradient-to-r from-orange-600 to-pink-600  transition duration-400 hover:bg-gradient-to-r 
        hover:from-orange-400 hover:to-pink-400 text-xl"
              type="submit"
            >
              Save Image
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
