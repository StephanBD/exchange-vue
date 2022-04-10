import { helpers } from "@vuelidate/validators";

export const supportedFileType = (value) => {
	// console.log(value);

	// if the value is empty then true because field should be  "valid"
	if (!helpers.req(value)) return true

	const allowFormats = ["jpg", "png", "jpeg", "svg"]
	const extension = value.split(".").pop()

	console.log(allowFormats.includes(extension));
	return allowFormats.includes(extension)
}


// allowFormats.forEach(format => {
// 	console.log(format);
// 	if (value.contains(format)) {
// 		console.log("existe: " + format);
// 		return true
// 	}
// });