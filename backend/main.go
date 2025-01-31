package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/hashicorp/hcl/v2/hclwrite"
	"github.com/rs/cors"
	"github.com/zclconf/go-cty/cty"
)

type EC2Details struct {
	SSHKeyPair     string   `json:"ssh_key_pair"`
	InstanceType   string   `json:"instance_type"`
	VPCID          string   `json:"vpc_id"`
	SecurityGroups []string `json:"security_groups"`
	Subnet         string   `json:"subnet"`
	Name           string   `json:"name"`
	Namespace      string   `json:"namespace"`
	Stage          string   `json:"stage"`
}

func generateTerraformModule(details EC2Details) string {
	f := hclwrite.NewEmptyFile()
	rootBody := f.Body()

	moduleBlock := rootBody.AppendNewBlock("module", []string{details.Name})
	moduleBody := moduleBlock.Body()

	moduleBody.SetAttributeValue("source", cty.StringVal("cloudposse/ec2-instance/aws"))
	moduleBody.SetAttributeValue("ssh_key_pair", cty.StringVal(details.SSHKeyPair))
	moduleBody.SetAttributeValue("instance_type", cty.StringVal(details.InstanceType))
	moduleBody.SetAttributeValue("vpc_id", cty.StringVal(details.VPCID))
	moduleBody.SetAttributeValue("subnet", cty.StringVal(details.Subnet))
	moduleBody.SetAttributeValue("name", cty.StringVal(details.Name))
	moduleBody.SetAttributeValue("namespace", cty.StringVal(details.Namespace))
	moduleBody.SetAttributeValue("stage", cty.StringVal(details.Stage))

	securityGroups := make([]cty.Value, 0, len(details.SecurityGroups))
	for _, sg := range details.SecurityGroups {
		securityGroups = append(securityGroups, cty.StringVal(sg))
	}
	moduleBody.SetAttributeValue("security_groups", cty.ListVal(securityGroups))

	return string(f.Bytes())
}

// func generateTerraformModule(details EC2Details) string {
// 	return fmt.Sprintf(`
// module "%s" {
//   source           = "cloudposse/ec2-instance/aws"
//   ssh_key_pair     = "%s"
//   instance_type    = "%s"
//   vpc_id           = "%s"
//   security_groups  = ["%s"]
//   subnet           = "%s"
//   name             = "%s"
//   namespace        = "%s"
//   stage            = "%s"
// }`,
// 		details.Name,
// 		details.SSHKeyPair,
// 		details.InstanceType,
// 		details.VPCID,
// 		join(details.SecurityGroups, `","`),
// 		details.Subnet,
// 		details.Name,
// 		details.Namespace,
// 		details.Stage)
// }

func join(items []string, delimiter string) string {
	result := ""
	for i, item := range items {
		result += item
		if i < len(items)-1 {
			result += delimiter
		}
	}
	return result
}

func handleGenerateTerraformConfig(w http.ResponseWriter, r *http.Request) {
	// Decode the request body into EC2Details struct
	var details EC2Details
	err := json.NewDecoder(r.Body).Decode(&details)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Generate the Terraform module configuration
	terraformConfig := generateTerraformModule(details)

	// Send the generated configuration as a response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"terraformConfig": terraformConfig,
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/generate", handleGenerateTerraformConfig)

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"}, // Frontend URL
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	}).Handler(mux)

	// http.HandleFunc("/generate", handleGenerateTerraformConfig)
	fmt.Println("Server running on http://localhost:8080...")
	http.ListenAndServe(":8080", corsHandler)
}
