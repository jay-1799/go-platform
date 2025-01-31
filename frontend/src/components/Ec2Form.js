import React, { useState } from "react";

const Ec2Form = () => {
  const [formData, setFormData] = useState({
    ssh_key_pair: "",
    instance_type: "",
    vpc_id: "",
    security_groups: "",
    subnet: "",
    name: "",
    namespace: "",
    stage: "",
  });

  const [generatedConfig, setGeneratedConfig] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const securityGroupsArray = formData.security_groups
      .split(",") // Split the string into an array based on commas
      .map((item) => item.trim()); // Remove extra spaces around the items

    const updatedFormData = {
      ...formData,
      security_groups: securityGroupsArray, // Update the security_groups field to an array
    };
    try {
      console.log("Form Data:", formData);
      const response = await fetch("http://localhost:8080/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setGeneratedConfig(data.terraformConfig); // Assuming backend returns the config in this field
    } catch (error) {
      console.error("Error generating Terraform config:", error);
    }
  };

  return (
    <div>
      <h1>Generate Terraform EC2 Configuration</h1>
      <form onSubmit={handleSubmit}>
        <label>
          SSH Key Pair:
          <input
            type="text"
            name="ssh_key_pair"
            value={formData.ssh_key_pair}
            onChange={handleChange}
          />
        </label>
        <label>
          Instance Type:
          <input
            type="text"
            name="instance_type"
            value={formData.instance_type}
            onChange={handleChange}
          />
        </label>
        <label>
          VPC ID:
          <input
            type="text"
            name="vpc_id"
            value={formData.vpc_id}
            onChange={handleChange}
          />
        </label>
        <label>
          Security Groups (comma-separated):
          <input
            type="text"
            name="security_groups"
            value={formData.security_groups}
            onChange={handleChange}
          />
        </label>
        <label>
          Subnet:
          <input
            type="text"
            name="subnet"
            value={formData.subnet}
            onChange={handleChange}
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Namespace:
          <input
            type="text"
            name="namespace"
            value={formData.namespace}
            onChange={handleChange}
          />
        </label>
        <label>
          Stage:
          <input
            type="text"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Generate</button>
      </form>

      {generatedConfig && (
        <div>
          <h2>Generated Terraform Configuration:</h2>
          <pre>{generatedConfig}</pre>
        </div>
      )}
    </div>
  );
};

export default Ec2Form;

// import React, { useState } from "react";
// import axios from "axios";

// const Ec2Form = () => {
//   const [formData, setFormData] = useState({
//     ssh_key_pair: "",
//     instance_type: "",
//     vpc_id: "",
//     security_groups: "",
//     subnet: "",
//     name: "",
//     namespace: "",
//     stage: "",
//   });

//   const [generatedConfig, setGeneratedConfig] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:8080/generate",
//         formData
//       );
//       setGeneratedConfig(response.data.terraformConfig); // Assuming backend returns the config in this field
//     } catch (error) {
//       console.error("Error generating Terraform config:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Generate Terraform EC2 Configuration</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           SSH Key Pair:
//           <input
//             type="text"
//             name="ssh_key_pair"
//             value={formData.ssh_key_pair}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Instance Type:
//           <input
//             type="text"
//             name="instance_type"
//             value={formData.instance_type}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           VPC ID:
//           <input
//             type="text"
//             name="vpc_id"
//             value={formData.vpc_id}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Security Groups (comma-separated):
//           <input
//             type="text"
//             name="security_groups"
//             value={formData.security_groups}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Subnet:
//           <input
//             type="text"
//             name="subnet"
//             value={formData.subnet}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Name:
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Namespace:
//           <input
//             type="text"
//             name="namespace"
//             value={formData.namespace}
//             onChange={handleChange}
//           />
//         </label>
//         <label>
//           Stage:
//           <input
//             type="text"
//             name="stage"
//             value={formData.stage}
//             onChange={handleChange}
//           />
//         </label>
//         <button type="submit">Generate</button>
//       </form>

//       {generatedConfig && (
//         <div>
//           <h2>Generated Terraform Configuration:</h2>
//           <pre>{generatedConfig}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Ec2Form;
