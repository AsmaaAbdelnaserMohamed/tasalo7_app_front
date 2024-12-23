// Function to get parameter from localStorage
function getLocalStorageParameter(name) {
    return localStorage.getItem(name) || '';
}
// Function to fill form fields from localStorage
document.addEventListener('DOMContentLoaded', function () {
    function fillFormFields() {
        var mo3aina_number = getLocalStorageParameter('mo3aina_number');
        var requester_name = getLocalStorageParameter('requester_name');
        var gov = getLocalStorageParameter('gov');
        var detailed_address = getLocalStorageParameter('detailed_address');
        var phonenumber = getLocalStorageParameter('phonenumber');
        var x_coordinate = getLocalStorageParameter('x_coordinate');
        var y_coordinate = getLocalStorageParameter('y_coordinate');

        if (mo3aina_number) {
            var mo3aina_numberField = document.querySelector('input[name="mo3aina_number"]');
            if (mo3aina_numberField) {
                mo3aina_numberField.value = mo3aina_number;
            }
        }

        if (gov) {
            var govField = document.querySelector('input[name="gov"]');
            if (govField) {
                govField.value = gov;
            }
        }

        if (requester_name) {
            var requester_nameField = document.querySelector('input[name="requester_name"]');
            if (requester_nameField) {
                requester_nameField.value = requester_name;
            }
        }

        if (detailed_address) {
            var detailed_addressField = document.querySelector('textarea[name="detailed_address"]');
            if (detailed_addressField) {
                detailed_addressField.value = detailed_address;
            }
        }

        if (phonenumber) {
            var phonenumberField = document.querySelector('input[name="phonenumber"]');
            if (phonenumberField) {
                phonenumberField.value = phonenumber;
            }
        }

        if (x_coordinate) {
            var x_coordinateField = document.querySelector('input[name="x_coordinate"]');
            if (x_coordinateField) {
                x_coordinateField.value = x_coordinate;
            }
        }


        if (y_coordinate) {
            var y_coordinateField = document.querySelector('input[name="y_coordinate"]');
            if (y_coordinateField) {
                y_coordinateField.value = y_coordinate;
            }
        }
    }

    // Call fillFormFields when DOM is fully loaded
    fillFormFields();
});

// // Function to update change status using API
// async function updateChangeStatus(requestNumber) {
//     const url = 'http://localhost:4500/api/updateStatus'; // رابط الـ API
//     const token = localStorage.getItem('token'); // استرجاع التوكن من الـ Local Storage

//     try {
//         const response = await fetch(url, {
//             method: 'PUT', // الطريقة PUT
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}` // تضمين التوكن
//             },
//             body: JSON.stringify({ requestnumber: requestNumber }) // البيانات المرسلة
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json(); // الحصول على البيانات من الاستجابة
//         console.log('Response from API:', result);

//         if (result.updatedData) {
//             console.log('Updated Data:', result.updatedData); // عرض البيانات المحدثة
//         }

//         alert('Change status updated successfully.');
//     } catch (error) {
//         console.error('Error updating change status:', error);
//         alert('Failed to update change status. Please try again.');
//     }
// }





// Function to save form data to localStorage
function saveFormData() {
    const getElementValue = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.value : '';
    };

    const getFieldValue = (name) => {
        const element = document.querySelector(`input[name="${name}"]`);
        return element ? element.value : '';
    };

    // Collecting form data
    const formData = {
        mo3aina_number: getElementValue('#mo3aina_number'),
        requester_name: getElementValue('#requester_name'),
        phonenumber: getFieldValue('phonenumber'),
        addeddate: getElementValue('#addeddate'),
        detailed_address: getElementValue('#detailed_address'),
        height_building_top_point: getFieldValue('height_building_top_point'),
        height_building_roof: getElementValue('#height_building_roof'),
        surveyor_name: getElementValue('#surveyor_name'),
        latitude: getElementValue('#latitude'),
        longitude: getElementValue('#longitude'),
        address_by_coordinate: getElementValue('#address_by_coordinate'),
        geha_name: getElementValue('#geha_name'),
        surveyor_nationalid: getElementValue('#surveyor_nationalid'),
        gov: getElementValue('#gov'),
        height_building: getElementValue('#height_building'),
        used_tools: getElementValue('#used_tools'),
        description_building: getElementValue('#description_building'),
        notes: getElementValue('#notes'),
        x_coordinate: getElementValue('#x_coordinate'),
        y_coordinate: getElementValue('#y_coordinate'),
    };

    console.log("Form Data before saving:", formData);

    // Check if any value is empty
    for (const key in formData) {
        if (!formData[key]) {
            console.warn(`Missing value for ${key}`);
        }
    }

    // Save data to localStorage as an array
    let storedData = JSON.parse(localStorage.getItem('formDataArray')) || [];
    storedData.push(formData); // Add new data to the array
    localStorage.setItem('formDataArray', JSON.stringify(storedData));
    console.log('Data saved in local storage successfully!');
}


// // Function to send all stored data from localStorage when internet is back
// function sendAllStoredData() {
//     return new Promise((resolve, reject) => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             alert('Please login again');
//             reject('No token found');
//             return;
//         }

//         const formDataArray = JSON.parse(localStorage.getItem('formDataArray') || '[]');
//         if (formDataArray.length === 0) {
//             console.log('No data to send');
//             resolve(); // Resolving the promise if there's no data
//             return;
//         }

//         console.log('Sending data:', formDataArray);
//         sendStoredData(formDataArray, token)
//             .then(() => {
//                 console.log('All data sent successfully');
//                 localStorage.clear(); // Clear after sending
//                 resolve();
//             })
//             .catch((error) => {
//                 console.error('Error sending data:', error);
//                 reject(error);
//             });
//     });
// }




// // Function to send multiple stored data entries at once
// function sendStoredData(formDataArray, token) {
//     return new Promise((resolve, reject) => {
//         const formData = formDataArray.shift(); // Get the first item

//         if (!formData) {
//             resolve(); // No data to send, resolve the Promise
//             return;
//         }

//         // إعداد البيانات لإرسالها عبر API أو أي خدمة أخرى
//         const combinedFormData = new FormData();
//         Object.keys(formData).forEach((key) => {
//             combinedFormData.append(key, formData[key]);
//         });

//         // إرسال البيانات عبر Fetch API
//         fetch('http://localhost:4500/api/saveData', {
//             method: 'POST',
//             headers: { 'Authorization': `Bearer ${token}` },
//             body: combinedFormData
//         })
//             .then(response => response.json())
//             .then(() => {
//                 console.log("Data sent successfully:", formData);
//                 // Continue sending remaining data
//                 sendStoredData(formDataArray, token).then(resolve).catch(reject);
//             })
//             .catch((error) => {
//                 console.error("Error while sending data:", error);
//                 reject(error);
//             });
//     });
// }


// // Check if internet connection is back
// window.addEventListener('online', () => {
//     console.log('Connection is back. Sending data...');
//     sendAllStoredData();
// });


function sendDataFromLocalStorage() {
    // الحصول على البيانات من localStorage
    const formDataArray = JSON.parse(localStorage.getItem('formDataArray') || '[]');

    if (formDataArray.length === 0) {
        console.log('No data to send');
        alert('لا توجد بيانات لإرسالها');
        return; // لا توجد بيانات لإرسالها
    }

    console.log('Sending data:', formDataArray);

    // تخزين البيانات في مكان آخر أو إرسالها إلى localStorage أو أي عملية أخرى
    // على سبيل المثال، سيتم تخزين البيانات في 'processedData'
    localStorage.setItem('processedData', JSON.stringify(formDataArray));

    alert('تم ارسال البيانات بنجاح');
}

// Event listener for send data button
document.getElementById('send-data').addEventListener('click', function () {
    // استدعاء الدالة لإرسال البيانات عند الحاجة
    // sendDataFromLocalStorage();
    alert('تم ارسال البيانات بنجاح');
    window.location.href = 'index.html';
});




// Open camera
const openCameraPopupButton = document.getElementById('openCameraPopup');

if (openCameraPopupButton) {
    openCameraPopupButton.addEventListener('click', function (event) {
        event.preventDefault(); // منع السلوك الافتراضي للزر

        const mo3aina_number = document.getElementById('mo3aina_number').value.trim();
        if (!mo3aina_number) {
            alert("يرجى إدخال رقم المعاينة.");
            return false;
        }

        const popupWidth = 620;
        const popupHeight = 440;
        const left = (window.screen.width / 2) - (popupWidth / 2);
        const top = (window.screen.height / 2) - (popupHeight / 2);

        window.open(
            `camera.html?mo3aina_number=${encodeURIComponent(mo3aina_number)}`,
            '_blank',
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
        );
    });
}

// get location
document.getElementById('getLocationButton').addEventListener('click', function () {
    const userConfirmation = confirm("هل متأكد من موقعك الحالي ؟");

    if (userConfirmation) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("خطأ في تحديد الموقع");
        }
    } else {
        alert("تم إلغاء عملية تحديد الموقع.");
    }
});

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    document.getElementById('latitude').value = latitude;
    document.getElementById('longitude').value = longitude;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=ar`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('address_by_coordinate').value = data.display_name;
        })
        .catch(error => console.error('Error:', error));
}

// Define the showError function to handle geolocation errors
function showError(error) {
    let errorMessage = "";

    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "تم رفض الوصول إلى موقعك.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "تعذر الحصول على الموقع الحالي.";
            break;
        case error.TIMEOUT:
            errorMessage = "انتهت مهلة تحديد الموقع.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "حدث خطأ غير معروف.";
            break;
    }

    alert("خطأ في تحديد الموقع: " + errorMessage);
}

// function to set the current date on page load

function formatDateToDMY(addeddate) {
    const day = String(addeddate.getDate()).padStart(2, '0'); // إضافة صفر إذا كان اليوم أقل من 10
    const month = String(addeddate.getMonth() + 1).padStart(2, '0'); // إضافة صفر إذا كان الشهر أقل من 10
    const year = addeddate.getFullYear();
    return `${day}-${month}-${year}`;
}

function setCurrentDate() {
    const today = new Date();
    const formattedDate = formatDateToDMY(today);
    document.getElementById('addeddate').value = formattedDate;
}

// Call the function to set the current date on page load
setCurrentDate();

function navigateToGuidnesList() {
    window.location.href = 'guidnesList.html';
}

// signature-pad
document.addEventListener('DOMContentLoaded', function () {
    const signaturePadSurveyor = document.getElementById("signature-pad-surveyor");
    const confirmSignatureSurveyorButton = document.getElementById("confirm-signature-surveyor");
    const clearSignatureButton = document.getElementById("clear-signature-surveyor");

    // إعداد التوقيع على الكانفاس
    const canvas = signaturePadSurveyor;
    const signaturePad = new SignaturePad(canvas);

    // وظيفة لمسح التوقيع
    function clearSignature(role) {
        if (role === 'surveyor') {
            signaturePad.clear();
        }
    }

    // وظيفة لتجميد التوقيع (منع الرسم)
    // function freezeSignature() {
    //     canvas.style.pointerEvents = "none"; // منع التفاعل مع الكانفاس بعد التأكيد
    // }

    // إضافة حدث لتأكيد التوقيع مع التأكيد وتنزيله
    confirmSignatureSurveyorButton.addEventListener("click", () => {
        if (signaturePad.isEmpty()) {
            alert("يرجى توقيع الحقل قبل التأكيد.");
        } else {
            const isConfirmed = confirm("هل أنت متأكد من تأكيد التوقيع؟");
            if (isConfirmed) {
                // تجميد التوقيع
                // freezeSignature();

                // تنزيل التوقيع
                const signatureData = signaturePad.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = signatureData;
                link.download = "signature.png"; // يمكن تغيير الاسم هنا
                link.click();

                console.log("تم تأكيد التوقيع وتنزيله.");
            }
        }
    });

    // إضافة حدث لمسح التوقيع
    clearSignatureButton.addEventListener("click", () => {
        clearSignature('surveyor');  // مسح التوقيع عندما يتم الضغط على زر المسح
    });
});
