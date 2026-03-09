import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import Footer from "../components/Footer";   // 👈 import Footer
import "./EditProfile.css";

const EditProfile = () => {
    const { user, setUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        profilePic: user?.profilePic || "",
        name: user?.name || "",
        surname: user?.surname || "",
        role: user?.role || "student",
        courseName: user?.courseName || "",
        courseEndMonth: user?.courseEndMonth || "",
        courseEndYear: user?.courseEndYear || "",
        department: user?.department || "",
        passedOutYear: user?.passedOutYear || ""
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profilePic" && files.length > 0) {
            setFormData({ ...formData, profilePic: URL.createObjectURL(files[0]) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUser({ ...user, ...formData });
        alert("Profile updated successfully!");
    };

    return (
        <div className="edit-profile-body">
            <div className="edit-profile-page">
                <h2>Edit Profile</h2>
                <form className="edit-profile-form" onSubmit={handleSubmit}>
                    {/* Profile Pic Upload */}
                    <label>
                        Profile Picture:
                        <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
                    </label>
                    {formData.profilePic && (
                        <img src={formData.profilePic} alt="Preview" className="profile-preview" />
                    )}

                    {/* Name & Surname */}
                    <label>
                        Name:
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </label>
                    <label>
                        Surname:
                        <input type="text" name="surname" value={formData.surname} onChange={handleChange} />
                    </label>

                    {/* Role Selection */}
                    <label>
                        Role:
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="student">Student</option>
                            <option value="alumni">Alumni</option>
                            <option value="staff">Staff</option>
                        </select>
                    </label>

                    {/* Conditional Fields */}
                    {formData.role === "student" && (
                        <>
                            <label>
                                Course Name:
                                <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} />
                            </label>
                            <label>
                                Course End Month:
                                <input type="text" name="courseEndMonth" value={formData.courseEndMonth} onChange={handleChange} />
                            </label>
                            <label>
                                Course End Year:
                                <input type="text" name="courseEndYear" value={formData.courseEndYear} onChange={handleChange} />
                            </label>
                        </>
                    )}

                    {formData.role === "staff" && (
                        <label>
                            Department:
                            <input type="text" name="department" value={formData.department} onChange={handleChange} />
                        </label>
                    )}

                    {formData.role === "alumni" && (
                        <label>
                            Passed Out Year:
                            <input type="text" name="passedOutYear" value={formData.passedOutYear} onChange={handleChange} />
                        </label>
                    )}

                    {/* Update Button */}
                    <button type="submit" className="update-btn">Update</button>
                </form>
            </div>

            {/* 👇 Footer at the bottom */}
            <Footer />
        </div>
    );
};

export default EditProfile;