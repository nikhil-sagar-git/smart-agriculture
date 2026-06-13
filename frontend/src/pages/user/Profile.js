
export default function Profile() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("useremail");

  async function getData() {
    try {
      const res = await fetch("http://localhost:4000/getdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      console.log(data);
      alert(data.message || "Data received");

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  }

  return (
    <div>
      <div className="navbar">
        <h2>Profile</h2>
      </div>

      <div className="form-container">
        <div className="profile-card">
          <h2>User Details</h2>

          <div className="profile-field">
            <label>Username</label>
            <p>{username}</p>
          </div>

          <div className="profile-field">
            <label>Email</label>
            <p>{email}</p>
          </div>

          <button className="btn" onClick={getData}>
            Get Data
          </button>
        </div>
      </div>
    </div>
  );
}