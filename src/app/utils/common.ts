export const validateImage = (fileObject: any) => {
    const maxFilesize = 1024 * 1024 * 2; // 2MB in bytes
    const responseValidate = { valid: true, message: '' };

    if (!["image/jpeg", "image/png"].includes(fileObject.type)) {
        responseValidate.valid = false;
        responseValidate.message = 'Invalide file type!';
    } else {
        if (fileObject.size > maxFilesize) {
            responseValidate.valid = false;
            responseValidate.message = 'Allow not over than 2MB!';
        }
    }

    return responseValidate;
}