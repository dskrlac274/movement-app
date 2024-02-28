import React, { useEffect, useState } from "react";
import { User, Envelope, Star, Check } from "@phosphor-icons/react";
import user from "../../../assets/user.png";
import Input from "../../atoms/Input";
import "./Profile.scss";
import Button from "../../atoms/Button";
import {
  deleteLoggedUser,
  editLoggedUser,
  getLoggedUser,
} from "../../../api/api";
// import FileInput from "../../FileInput/FileInput";
import Swal from "sweetalert2";

import { notifySuccess, notifyFailure } from "../../atoms/Toast/Toast";

const Profile = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleDelete = async () => {
    // Show SweetAlert confirmation
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed to delete
        await deleteLoggedUser();
        Swal.fire("Deleted!", "Your account has been deleted.", "success");
      }
    });
  };
  const handleSaveChanges = async () => {
    setIsEdit(false);

    try {
      await editLoggedUser({
        id: loggedUser.id,
        firstName: loggedUser.first_name,
        lastName: loggedUser.last_name,
        email: loggedUser.email,
      });

      notifySuccess("Successfully edited profile!");
    } catch (error) {
      console.error("Error updating user data:", error);
      notifyFailure();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfileData = await getLoggedUser();
        setLoggedUser(userProfileData.data.user);
      } catch (error) {
        console.error("Error fetching logged user:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="profile-wrapper">
      {loggedUser ? (
        <div className="profile-container">
          <div className="edit-image-container">
            <label htmlFor="file-upload">
              <img src={user} alt="user-image" />
            </label>
          </div>
          <div className="profile-user-data">
            {/* <FileInput onFileChange={handleFileChange} /> */}
            <div className="profile-user-data-row">
              <User size={32} weight="bold" />
              <Input
                defaultValue={loggedUser?.first_name}
                onChange={(e) =>
                  setLoggedUser({ ...loggedUser, first_name: e.target.value })
                }
              />

              <Input
                defaultValue={loggedUser?.last_name}
                onChange={(e) =>
                  setLoggedUser({ ...loggedUser, last_name: e.target.value })
                }
                setIsEdit={setIsEdit}
              />
            </div>
            <div className="profile-user-data-row">
              <Envelope size={32} />
              <p>{loggedUser?.email}</p>
            </div>
            <div className="profile-user-data-row">
              <Star size={32} weight="fill" />
              <p>{loggedUser?.ratings_average}/5</p>
            </div>
            <div className="profile-user-data-row">
              <Check size={32} />
              <p>{loggedUser?.ratings_quantity} reviews</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <Button onClick={handleSaveChanges}>Save changes</Button>
      <Button isRed={true} onClick={handleDelete}>
        Delete my account
      </Button>
    </div>
  );
};

export default Profile;
