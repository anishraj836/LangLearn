import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { updateProfile } from '../lib/api';
import useAuthUser from '../hooks/useAuthUser';
import { toast } from 'react-hot-toast';
import { CameraIcon, MapPinIcon, ShipWheelIcon, LoaderIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants';
import { getRandomAvatar } from '../lib/utils';

const EditProfilePage = () => {
  const { authUser, isLoading } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: '',
    bio: '',
    nativeLanguage: '',
    learningLanguage: '',
    location: '',
    profilePic: '',
  });

  // Update form state when authUser data becomes available
  useEffect(() => {
    if (authUser) {
      setFormState({
        fullName: authUser.fullName || '',
        bio: authUser.bio || '',
        nativeLanguage: authUser.nativeLanguage || '',
        learningLanguage: authUser.learningLanguage || '',
        location: authUser.location || '',
        profilePic: authUser.profilePic || '',
      });
    }
  }, [authUser]);

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation(formState);
  };

  const handleRandomAvatar = () => {
    const avatarUrl = getRandomAvatar();
    setFormState((prev) => ({ ...prev, profilePic: avatarUrl }));
    toast.success("New avatar generated!");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="loading loading-spinner loading-lg"></div>
          <span className="ml-2">Loading profile...</span>
        </div>
      ) : (
        <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PROFILE PIC CONTAINER */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate New Avatar
                </button>
              </div>

              {/* FULL NAME */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="Your full name"
                />
              </div>

              {/* BIO */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell others about yourself and your language learning goals"
                />
              </div>

              {/* LANGUAGES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    value={formState.learningLanguage}
                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="input input-bordered w-full pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button className="btn btn-primary w-full" disabled={isPending} type="submit">
                {!isPending ? (
                  <>
                    <ShipWheelIcon className="size-5 mr-2" />
                    Update Profile
                  </>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Updating...
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;