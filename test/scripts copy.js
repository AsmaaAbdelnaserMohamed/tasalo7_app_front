// Function to get parameter from localStorage
function getLocalStorageParameter(name) {
    return localStorage.getItem(name) || '';
}

// Function to fill form fields from localStorage
document.addEventListener('DOMContentLoaded', function () {
    function fillFormFields() {
        var requestNumber = getLocalStorageParameter('requestNumber');
        var requestid = getLocalStorageParameter('requestid');
        var requesterName = getLocalStorageParameter('requesterName');
        var fullname = getLocalStorageParameter('fullname');
        var companyName = getLocalStorageParameter('companyName');
        var sector = getLocalStorageParameter('sector');
        var ssec = getLocalStorageParameter('ssec');
        var secText = getLocalStorageParameter('secText');
        var ssecText = getLocalStorageParameter('ssecText');
        var surveyTeamId = getLocalStorageParameter('surveyTeamId');
        var areaRequest = getLocalStorageParameter('areaRequest');

        if (requestNumber) {
            var requestNumberField = document.querySelector('input[name="request-number"]');
            if (requestNumberField) {
                requestNumberField.value = requestNumber;
            }
        }


        if (requestid) {
            var requestidField = document.querySelector('input[name="requestid"]');
            if (requestidField) {
                requestidField.value = requestid;
            }
        }
        if (requesterName) {
            var requesterNameField = document.querySelector('input[name="requester-name"]');
            if (requesterNameField) {
                requesterNameField.value = requesterName;
            }
        }

        if (fullname) {
            var fullnameField = document.querySelector('input[name="applicant-name"]');
            if (fullnameField) {
                fullnameField.value = fullname;
            }
        }

        if (companyName) {
            var companyNameField = document.querySelector('input[name="company-name"]');
            if (companyNameField) {
                companyNameField.value = companyName;
            }
        }
        if (ssec) {
            var ssecField = document.querySelector('input[name="ssec"]');
            if (ssecField) {
                ssecField.value = ssec;
            }
        }

        if (sector) {
            var sectorField = document.querySelector('input[name="sector"]');
            if (sectorField) {
                sectorField.value = sector;
            }
        }


        if (secText) {
            var secTextField = document.querySelector('input[name="secText"]');
            if (secTextField) {
                secTextField.value = secText;
            }
        }


        if (ssecText) {
            var ssecTextField = document.querySelector('input[name="ssecText"]');
            if (ssecTextField) {
                ssecTextField.value = ssecText;
            }
        }



        if (surveyTeamId) {
            var surveyTeamIdField = document.querySelector('input[name="company-code"]');
            if (surveyTeamIdField) {
                surveyTeamIdField.value = surveyTeamId;
            }
        }

        if (areaRequest) {
            var areaRequestField = document.querySelector('input[name="area_request"]');
            if (areaRequestField) {
                areaRequestField.value = areaRequest;
            }
        }
    }

    // Call fillFormFields when DOM is fully loaded
    fillFormFields();
});


// إعدادات اللوحة والرسم
var canvas = new fabric.Canvas('map-canvas');
var isDrawing = false;
var points = [];
var northArrowImageSrc = 'images/North-Arrow.png';

// إعداد الخلفية
canvas.setBackgroundColor('rgb(255, 255, 255)', canvas.renderAll.bind(canvas));

// إضافة صورة سهم الشمال
fabric.Image.fromURL(northArrowImageSrc, function (img) {
    img.set({
        left: 6,
        top: 6,
        scaleX: 0.05,
        scaleY: 0.03,
        selectable: false,
        evented: false
    });
    img.set('id', 'northArrow');
    canvas.add(img);
    canvas.renderAll();
});

// تمكين الرسم الحر
function startDrawing() {
    canvas.isDrawingMode = true;
}

// تصدير الصورة
function exportCanvasImage() {
    return new Promise((resolve) => {
        var inputTop = document.getElementById('input-top').value;
        var inputBottom = document.getElementById('input-bottom').value;
        var inputLeft = document.getElementById('input-left').value;
        var inputRight = document.getElementById('input-right').value;

        // إضافة نصوص الإدخال إلى اللوحة
        var textTop = new fabric.Text(inputTop, {
            left: canvas.width / 2,
            top: 10,
            fontSize: 14,
            originX: 'center'
        });

        var textBottom = new fabric.Text(inputBottom, {
            left: canvas.width / 2,
            top: canvas.height - 20,
            fontSize: 14,
            originX: 'center'
        });

        var textLeft = new fabric.Text(inputLeft, {
            left: 10,
            top: canvas.height / 2,
            fontSize: 14,
            angle: -90,
            originY: 'center'
        });

        var textRight = new fabric.Text(inputRight, {
            left: canvas.width - 20,
            top: canvas.height / 2,
            fontSize: 14,
            angle: 90,
            originY: 'center'
        });

        canvas.add(textTop, textBottom, textLeft, textRight);
        canvas.renderAll();

        // تصدير كصورة
        var dataURL = canvas.toDataURL('image/png');
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = 'canvas.png';
        a.click();

        // إزالة النص بعد التصدير
        canvas.remove(textTop, textBottom, textLeft, textRight);
        canvas.renderAll();

        resolve();
    });
}

// الدوال الأخرى لعمليات الرسم والتحكم
function endDrawing() {
    const endDrawingButton = document.getElementById('endDrawingButton');

    if (confirm('هل أنت متأكد من إنهاء الرسم؟')) {
        canvas.isDrawingMode = false;
        isDrawing = false;
        finalizePolygon().then(() => {
            endDrawingButton.disabled = true;
        });
    }
}

function clearCanvas() {
    canvas.getObjects().forEach(obj => {
        if (obj.id !== 'northArrow') {
            canvas.remove(obj);
        }
    });
    canvas.renderAll();
}

function addPoint(event) {
    if (!isDrawing) return;
    var pointer = canvas.getPointer(event.e);
    points.push({ x: pointer.x, y: pointer.y });
    if (points.length > 1) {
        drawPolygon(event);
    }
}

function drawPolygon(event) {
    if (!isDrawing || points.length < 2) return;

    var existingPolygons = canvas.getObjects().filter(obj => obj.type === 'polygon');
    existingPolygons.forEach(polygon => canvas.remove(polygon));

    var polygon = new fabric.Polygon(points, {
        stroke: 'black',
        fill: 'rgba(0, 0, 0, 0.1)',
        strokeWidth: 2,
        selectable: false,
        evented: false
    });
    canvas.add(polygon);
}

function finalizePolygon() {
    return new Promise((resolve) => {
        if (points.length > 2) {
            var polygon = new fabric.Polygon(points, {
                stroke: 'black',
                fill: 'rgba(0, 0, 0, 0.1)',
                strokeWidth: 2,
            });
            canvas.add(polygon);
            points = [];
            alert('تم إنهاء الرسم بنجاح!');
        }
    });
}

// function deleteSelectedObject() {
//     const activeObject = canvas.getActiveObject();
//     if (activeObject && activeObject.id !== 'northArrow') {
//         canvas.remove(activeObject);
//     }
// }

// document.addEventListener('DOMContentLoaded', function () {
//     const deleteButton = document.getElementById('deleteObjectButton');
//     if (deleteButton) {
//         deleteButton.addEventListener('click', deleteSelectedObject);
//     }

//     const clearButton = document.getElementById('clearCanvasButton');
//     if (clearButton) {
//         clearButton.addEventListener('click', clearCanvas);
//     }
// });

// canvas.on('object:selected', function (e) {
// });

// canvas.on('selection:cleared', function () {
// });


// Function to save form data
// function saveFormData() {
//     const getElementValue = (selector) => {
//         const element = document.querySelector(selector);
//         return element ? element.value : '';
//     };

//     const getFieldValue = (name) => {
//         const elements = document.querySelectorAll(`input[name="${name}"]`);
//         for (const element of elements) {
//             if (element.value) {
//                 return element.value;
//             }
//         }
//         return '';
//     };

//     const formData = {
//         requestNumber: getElementValue('#request-number'),
//         requestid: getElementValue('#requestid'),
//         requesterName: getElementValue('#requester-name'),
//         applicantName: getElementValue('#applicant-name'),
//         sector: getElementValue('#sector'),
//         ssec: getElementValue('#ssec'),
//         secText: getElementValue('#secText'),
//         ssecText: getElementValue('#ssecText'),
//         ket3aNumber: getFieldValue('ket3a-number'),
//         buildingNumber: getFieldValue('building-number'),
//         hodNumber: getFieldValue('hod-number'),
//         northBorder: getElementValue('#north_border'),
//         northBorderLength: getElementValue('#north_border-length'),
//         southBorder: getElementValue('#south_border'),
//         southBorderLength: getElementValue('#south_border-length'),
//         eastBorder: getElementValue('#east_border'),
//         eastBorderLength: getElementValue('#east_border-length'),
//         westBorder: getElementValue('#west_border'),
//         westBorderLength: getElementValue('#west_border-length'),
//         latitude: getElementValue('#latitude'),
//         longitude: getElementValue('#longitude'),
//         address: getElementValue('#address'),
//         areaRequest: getElementValue('#area_request'),
//         areaSurvey: getElementValue('#area_survey'),
//         description: getElementValue('#description'),
//         usageBuilding: getElementValue('#usage_building'),
//         surveyorName: getElementValue('input[name="surveyor-name"]'),
//         surveyorName2: getElementValue('input[name="surveyor-name2"]'),
//         iqrarName: getElementValue('input[name="iqrar_name"]'),
//         surveyTeamId: getElementValue('input[name="company-code"]'),
//         date: getElementValue('input[name="date"]'),
//         evaluation: getElementValue('input[name="evaluation"]:checked'),
//         descriptionNearestSign: getElementValue('#description_nearest_sign'),
//         detailed_address: getElementValue('#detailed_address'),
//         floor_number: getElementValue('#floor_number'),
//         floor_number_text: getElementValue('#floor_number_text'),
//         survey_apartment_number: getElementValue('#survey_apartment_number'),
//         actual_apartment_number: getElementValue('#actual_apartment_number'),
//         survey_type: getElementValue('#survey_type'),
//     };

//     console.log("Form Data before saving:", formData); // التحقق من البيانات

//     // حفظ البيانات في التخزين المحلي
//     localStorage.setItem('formData', JSON.stringify(formData));
//     console.log('تم حفظ البيانات في التخزين المحلي!');
// }

// // Function to send data and include Blob in request body
// function sendData() {
//     return new Promise((resolve, reject) => {
//         saveFormData(); // حفظ البيانات قبل إرسالها

//         const storedData = localStorage.getItem('formData');
//         if (!storedData) {
//             console.error('لا توجد بيانات في localStorage');
//             reject('لا توجد بيانات في localStorage');
//             return;
//         }

//         const formData = JSON.parse(storedData);
//         console.log('localStorage:', formData);

//         // إضافة صورة الكروكي للـ FormData
//         const formToSend = new FormData();
//         Object.keys(formData).forEach(key => {
//             formToSend.append(key, formData[key]);
//         });
//         // formToSend.append('kroqui-image', blob, 'kroky_image.png'); // إضافة ملف الصورة

//         // الحصول على التوكن من localStorage
//         const token = localStorage.getItem('token'); // استرجاع التوكن من التخزين
//         console.log('Token:', token); // التأكد من وجود التوكن

//         console.log('Online status:', navigator.onLine); // التحقق من حالة الاتصال

//         if (navigator.onLine) {
//             fetch('http://localhost:5000/api/saveData', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}` // إضافة التوكن في الهيدرز
//                 },
//                 body: formToSend
//             })
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error(`HTTP error! Status: ${response.status}`);
//                     }
//                     return response.json();
//                 })
//                 .then(data => {
//                     console.log('successfully:', data);

//                     localStorage.setItem('dataSent', 'true');
//                     localStorage.removeItem('formData');

//                     if (!window.alertDisplayed) {
//                         alert('تم إرسال البيانات وتنظيف التخزين المحلي بنجاح!');
//                         window.alertDisplayed = true;
//                     }

//                     resolve(); // نجاح
//                 })
//                 .catch((error) => {
//                     console.error('error:', error);
//                     reject(error); // خطأ
//                 });
//         } else {
//             alert('لا يوجد اتصال بالإنترنت. سيتم تخزين البيانات وإرسالها لاحقاً.');
//             reject('لا يوجد اتصال بالإنترنت');
//         }
//     });
// }

// // Event listener for exporting and sending data
// document.getElementById("exportKroky").addEventListener("click", function () {
//     var krokyMap = document.querySelector('#krokyMap');
//     const requestNumber = document.getElementById("request-number").value; // Get request number

//     // التقاط الصورة باستخدام dom-to-image
//     domtoimage.toPng(krokyMap)
//         .then(function (dataUrl) {
//             // تحويل الصورة إلى Blob
//             fetch(dataUrl)
//                 .then(res => res.blob())
//                 .then(blob => {
//                     sendData() // استدعاء sendData مع الـ Blob
//                         .then(() => {
//                             document.getElementById("responseMessage").innerHTML = "تم رفع الصورة والبيانات بنجاح!";
//                         })
//                         .catch(error => {
//                             document.getElementById("responseMessage").innerHTML = "خطأ في رفع الصورة والبيانات.";
//                             console.error('Error:', error);
//                         });
//                 });
//         })
//         .catch(function (error) {
//             console.error('خطأ في التقاط الصورة', error);
//         });
// });

// // Function to clear the form after successful submission
// function resetForm() {
//     const clearInput = (id) => {
//         const el = document.getElementById(id);
//         if (el) el.value = '';
//     };
//     clearInput('request-number');
//     clearInput('requestid');
//     clearInput('requester-name');
//     clearInput('sector');
//     clearInput('ssec');
//     clearInput('secText');
//     clearInput('ssecText');
//     clearInput('ket3a-number');
//     clearInput('building-number');
//     clearInput('hod-number');
//     clearInput('north_border');
//     clearInput('north_border-length');
//     clearInput('south_border');
//     clearInput('south_border-length');
//     clearInput('east_border');
//     clearInput('east_border-length');
//     clearInput('west_border');
//     clearInput('west_border-length');
//     clearInput('latitude');
//     clearInput('longitude');
//     clearInput('address');
//     clearInput('area_request');
//     clearInput('area_survey');
//     clearInput('description');
//     clearInput('usage_building');
//     clearInput('description_nearest_sign');
//     clearInput('detailed_address');
//     clearInput('floor_number');
//     clearInput('floor_number_text');
//     clearInput('survey_apartment_number');
//     clearInput('actual_apartment_number');
//     clearInput('survey_type');
//     clearInput('applicant-name');

//     // Clear additional fields
//     const clearQueryInput = (selector) => {
//         const el = document.querySelector(selector);
//         if (el) el.value = '';
//     };
//     clearQueryInput('input[name="surveyor-name"]');
//     clearQueryInput('input[name="surveyor-name2"]');
//     clearQueryInput('input[name="company-code"]');
//     clearQueryInput('input[name="iqrar_name"]');
//     clearQueryInput('input[name="kinship"]');
//     clearQueryInput('input[name="date"]');

//     // Reset evaluation radio button
//     const checkedEvaluation = document.querySelector('input[name="evaluation"]:checked');
//     if (checkedEvaluation) {
//         checkedEvaluation.checked = false;
//     }

//     // Reset window.alertDisplayed flag
//     window.alertDisplayed = false;

//     if (signaturePadApplicant) {
//         signaturePadApplicant.clear();
//     }
//     if (signaturePadSurveyor) {
//         signaturePadSurveyor.clear();
//     }
//     // Clear canvas
//     clearCanvas();
// }

// // Function to check internet connectivity and send pending data
// function checkConnectivity() {
//     if (navigator.onLine) {
//         if (localStorage.getItem('dataSent') !== 'true' && localStorage.getItem('formData')) {
//             sendData();
//         }
//     }
// }


// Function to save form data


function saveFormData() {
    const getElementValue = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.value : '';
    };

    const getFieldValue = (name) => {
        const elements = document.querySelectorAll(`input[name="${name}"]`);
        for (const element of elements) {
            if (element.value) {
                return element.value;
            }
        }
        return '';
    };

    const formData = {
        requestNumber: getElementValue('#request-number'),
        // requestid: getElementValue('#requestid'),
        requesterName: getElementValue('#requester-name'),
        // applicantName: getElementValue('#applicant-name'),
        // sector: getElementValue('#sector'),
        // ssec: getElementValue('#ssec'),
        // secText: getElementValue('#secText'),
        // ssecText: getElementValue('#ssecText'),
        ket3aNumber: getFieldValue('ket3a-number'),
        buildingNumber: getFieldValue('building-number'),
        hodNumber: getFieldValue('#hod-number'),
        // northBorder: getElementValue('#north_border'),
        // northBorderLength: getElementValue('#north_border_length'),
        // southBorder: getElementValue('#south_border'),
        // southBorderLength: getElementValue('#south_border_length'),
        // eastBorder: getElementValue('#east_border'),
        // eastBorderLength: getElementValue('#east_border_length'),
        // westBorder: getElementValue('#west_border'),
        // westBorderLength: getElementValue('#west_border_length'),
        // latitude: getElementValue('#latitude'),
        // longitude: getElementValue('#longitude'),
        address: getElementValue('#address'),
        // areaRequest: getElementValue('#area_request'),
        // areaSurvey: getElementValue('#area_survey'),
        // description: getElementValue('#description'),
        // usageBuilding: getElementValue('#usage_building'),
        surveyorName: getElementValue('#surveyor-name'),
        // surveyorName2: getElementValue('select[name="surveyor-name2"] '),
        // iqrarName: getElementValue('input[name="iqrar_name"]'),
        surveyTeamId: getElementValue('input[name="company-code"]'),
        date: getElementValue('input[name="date"]'),
        evaluation: getElementValue('input[name="evaluation"]:checked'),
        descriptionNearestSign: getElementValue('#description_nearest_sign'),
        detailed_address: getElementValue('#detailed_address'),
        floor_number: getElementValue('#floor_number'),
        floor_number_text: getElementValue('#floor_number_text'),
        survey_apartment_number: getElementValue('#survey_apartment_number'),
        actual_apartment_number: getElementValue('#actual_apartment_number'),
        survey_type: getElementValue('#survey_type'),
        kinship: getElementValue('#kinship')
    };

    console.log("Form Data before saving:", formData);

    // حفظ البيانات في التخزين المحلي
    localStorage.setItem('formData', JSON.stringify(formData));
    console.log('تم حفظ البيانات في التخزين المحلي!');
}

// دالة لإرسال البيانات والتقاط الصورة وإدراجها في جسم الطلب
function sendData(requestNumber, applicantName) {
    return new Promise((resolve, reject) => {
        saveFormData();

        const storedData = localStorage.getItem('formData');
        const formData = JSON.parse(storedData);

        const token = localStorage.getItem('token');
        if (!token) {
            alert('برجاء تسجيل الدخول مرة اخري');
            return;
        }

        if (navigator.onLine) {
            // التقاط الصورة وإرسالها مع البيانات
            const krokyMap = document.getElementById("krokyMap");
            domtoimage.toBlob(krokyMap, {
                bgcolor: '#ffffff',
                width: krokyMap.offsetWidth * 1,
                height: krokyMap.offsetHeight * 1.2
            })
                .then(blob => {
                    // إنشاء كائن FormData لإرسال البيانات والصورة
                    const combinedFormData = new FormData();
                    combinedFormData.append('requestNumber', formData.requestNumber);
                    combinedFormData.append('applicantName', formData.applicantName);
                    combinedFormData.append('kroqui-image', blob, 'kroky_image.jpg');

                    // إضافة البيانات الإضافية هنا
                    // combinedFormData.append('additionalField', 'value');

                    return fetch('http://localhost:5000/api/saveData', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: combinedFormData
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data and image saved successfully:', data);
                    localStorage.setItem('dataSent', 'true');
                    localStorage.removeItem('formData');
                    alert('تم إرسال البيانات والصورة وتنظيف التخزين المحلي بنجاح!');

                    // تحديث البيانات الأخرى (يمكن دمجها في الطلب السابق إذا كان ممكناً)
                    return fetch('http://localhost:5000/api/updateAddress', {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: createAddressFormData(formData)
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(addressUpdateData => {
                    console.log('Address data updated successfully:', addressUpdateData);
                    alert('تم تحديث العنوان بنجاح!');

                    return fetch('http://localhost:5000/api/FieldData', {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: createFieldDataFormData(formData)
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(fieldData => {
                    console.log('Field data updated successfully:', fieldData);
                    alert('تم تحديث بيانات FieldData بنجاح!');

                    return fetch('http://localhost:5000/api/updateStatusAssignment', {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: createStatusFormData(formData)
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(statusUpdateData => {
                    console.log('Assignment status updated successfully:', statusUpdateData);
                    alert('تم تحديث حالة الطلب بنجاح!');

                    // تحديث المعلومات الإضافية
                    const extraInfoFormData = new FormData();
                    extraInfoFormData.append('requestNumber', formData.requestNumber);
                    extraInfoFormData.append('applicantName', formData.applicantName);

                    return fetch('http://localhost:5000/api/updateExtraInfo', {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: extraInfoFormData
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(extraInfoData => {
                    console.log('Extra info updated successfully:', extraInfoData);
                    alert('تم تحديث المعلومات الإضافية بنجاح!');
                    resolve();
                })
                .catch((error) => {
                    console.error('Error:', error);
                    reject(error);
                });
        } else {
            alert('لا يوجد اتصال بالإنترنت. سيتم تخزين البيانات وإرسالها لاحقاً.');
            reject('لا يوجد اتصال بالإنترنت');
        }
    });
}



function createFormData(formData) {
    const formToSend = new FormData();
    Object.keys(formData).forEach(key => {
        formToSend.append(key, formData[key]);
    });
    return formToSend;
}

function createAddressFormData(formData) {
    const addressFormData = new FormData();
    addressFormData.append('requestid', formData.requestid);
    addressFormData.append('sector', formData.sector);
    addressFormData.append('ssec', formData.ssec);
    addressFormData.append('buildingNumber', formData.buildingNumber);
    addressFormData.append('hodNumber', formData.hodNumber);
    addressFormData.append('ket3aNumber', formData.ket3aNumber);
    addressFormData.append('floor_number', formData.floor_number);
    addressFormData.append('actual_apartment_number', formData.actual_apartment_number);
    addressFormData.append('descriptionNearestSign', formData.descriptionNearestSign);
    addressFormData.append('floor_number_text', formData.floor_number_text);
    return addressFormData;
}

function createFieldDataFormData(formData) {
    const fieldDataForm = new FormData();
    fieldDataForm.append('usageBuilding', formData.usageBuilding);
    fieldDataForm.append('northBorder', formData.northBorder);
    fieldDataForm.append('northBorderLength', formData.northBorderLength);
    fieldDataForm.append('southBorder', formData.southBorder);
    fieldDataForm.append('southBorderLength', formData.southBorderLength);
    fieldDataForm.append('eastBorder', formData.eastBorder);
    fieldDataForm.append('eastBorderLength', formData.eastBorderLength);
    fieldDataForm.append('westBorder', formData.westBorder);
    fieldDataForm.append('westBorderLength', formData.westBorderLength);
    fieldDataForm.append('survey_apartment_number', formData.survey_apartment_number);
    fieldDataForm.append('survey_type', formData.survey_type);
    fieldDataForm.append('description', formData.description);
    fieldDataForm.append('guidreportpaper_path', formData.guidreportpaper_path);
    fieldDataForm.append('date', formData.date);
    fieldDataForm.append('requestNumber', formData.requestNumber);
    return fieldDataForm;
}

function createStatusFormData(formData) {
    const statusFormData = new FormData();
    statusFormData.append('requestNumber', formData.requestNumber);
    return statusFormData;
}



// Open camera
const openCameraPopupButton = document.getElementById('openCameraPopup');

if (openCameraPopupButton) {
    openCameraPopupButton.addEventListener('click', function (event) {
        event.preventDefault(); // منع السلوك الافتراضي للزر

        const requestNumber = document.getElementById('request-number').value.trim();
        if (!requestNumber) {
            alert("يرجى إدخال رقم الطلب.");
            return false;
        }

        const popupWidth = 620;
        const popupHeight = 440;
        const left = (window.screen.width / 2) - (popupWidth / 2);
        const top = (window.screen.height / 2) - (popupHeight / 2);

        window.open(
            `camera.html?requestNumber=${encodeURIComponent(requestNumber)}`,
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
            document.getElementById('address').value = data.display_name;
        })
        .catch(error => console.error('Error:', error));
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("تم رفض طلب الموقع من قبل المستخدم.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("معلومات الموقع غير متوفرة.");
            break;
        case error.TIMEOUT:
            alert("انتهى وقت الطلب للحصول على الموقع.");
            break;
        case error.UNKNOWN_ERROR:
            alert("حدث خطأ غير معروف.");
            break;
    }
}


//signature-pad
document.addEventListener('DOMContentLoaded', function () {
    // الحصول على العناصر
    var applicantCanvas = document.getElementById('signature-pad-applicant');
    var surveyorCanvas = document.getElementById('signature-pad-surveyor');
    var confirmSignatureApplicantButton = document.getElementById('confirm-signature-applicant');
    var confirmSignatureSurveyorButton = document.getElementById('confirm-signature-surveyor');
    var sendDataButton = document.getElementById('send-data');

    // التحقق من وجود العناصر
    if (applicantCanvas && surveyorCanvas && confirmSignatureApplicantButton && confirmSignatureSurveyorButton && sendDataButton) {
        // إعدادات مشتركة للتوقيعين
        var sharedOptions = {
            penColor: '#333', // لون HEX للخط
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // خلفية شفافة
            // minWidth: 2, // أدنى عرض للخط
            // maxWidth: 4 // أقصى عرض للخط
        };

        var signaturePadApplicant = new SignaturePad(applicantCanvas, sharedOptions);
        var signaturePadSurveyor = new SignaturePad(surveyorCanvas, sharedOptions);

        var isApplicantSignatureConfirmed = false;
        var isSurveyorSignatureConfirmed = false;

        window.clearSignature = function (type) {
            if (type === 'applicant' && !isApplicantSignatureConfirmed) {
                signaturePadApplicant.clear();
            } else if (type === 'surveyor' && !isSurveyorSignatureConfirmed) {
                signaturePadSurveyor.clear();
            }
        };

        confirmSignatureApplicantButton.addEventListener('click', function () {
            if (!isApplicantSignatureConfirmed && !signaturePadApplicant.isEmpty()) {
                var confirmResult = confirm('هل أنت متأكد من التوقيع؟');
                if (confirmResult) {
                    isApplicantSignatureConfirmed = true;
                    disableSignaturePad(signaturePadApplicant);
                    alert('تم تأكيد توقيع مقدم الطلب.');
                }
            } else {
                alert('الرجاء تقديم توقيع أولاً.');
            }
        });

        confirmSignatureSurveyorButton.addEventListener('click', function () {
            if (!isSurveyorSignatureConfirmed && !signaturePadSurveyor.isEmpty()) {
                var confirmResult = confirm('هل أنت متأكد من التوقيع؟');
                if (confirmResult) {
                    isSurveyorSignatureConfirmed = true;
                    disableSignaturePad(signaturePadSurveyor);
                    alert('تم تأكيد توقيع القادم بالرفع.');
                }
            } else {
                alert('الرجاء تقديم توقيع أولاً.');
            }
        });

        sendDataButton.addEventListener('click', function () {
            if (isApplicantSignatureConfirmed && isSurveyorSignatureConfirmed) {
                // احصل على رقم الطلب
                var requestNumber = document.getElementById('request-number').value.trim();

                if (!requestNumber) {
                    alert('يرجى إدخال رقم الطلب.');
                    return;
                }

                // تحويل التوقيعات إلى صور
                var applicantDataURL = signaturePadApplicant.toDataURL();
                var surveyorDataURL = signaturePadSurveyor.toDataURL();

                // تحميل التوقيعات كصور باستخدام رقم الطلب
                downloadImage(applicantDataURL, `${requestNumber}_applicant_signature.png`);
                downloadImage(surveyorDataURL, `${requestNumber}_surveyor_signature.png`);

                // إرسال البيانات عبر AJAX أو أي طريقة أخرى (تم الإشارة إلى ذلك كملاحظة في الشيفرة)

                // تنظيف النموذج
                document.getElementById('fileUploadForm').reset();
                signaturePadApplicant.clear();
                signaturePadSurveyor.clear();
                // تنظيف محتوى Canvas أو أي عنصر آخر إذا كان ضروريًا
                clearCanvas(); // تأكد من أن لديك دالة clearCanvas() لتعريف كيفية تنظيف Canvas الخاص بك

                // إعادة تفعيل لوحات التوقيع لإعادة الاستخدام
                enableSignaturePad(signaturePadApplicant);
                enableSignaturePad(signaturePadSurveyor);
                isApplicantSignatureConfirmed = false;
                isSurveyorSignatureConfirmed = false;
            } else {
                alert('يرجى تأكيد جميع التوقيعات قبل إرسال البيانات.');
            }
        });

        // Function to download image
        function downloadImage(dataURL, filename) {
            var a = document.createElement('a');
            a.href = dataURL;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        // const sendDataButton = document.getElementById('send-data');

        document.getElementById('send-data').addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default page reload
            sendData(); // Call function to send data with images
        });



        // Ensure data sending when connectivity is restored
        // window.addEventListener('online', checkConnectivity);
        // window.addEventListener('offline', checkConnectivity);

        function disableSignaturePad(signaturePad) {
            if (signaturePad && signaturePad._canvas) {
                signaturePad.off();
                signaturePad._canvas.style.pointerEvents = 'none';
            } else {
                console.error('signaturePad أو _canvas غير معرف.');
            }
        }

        function enableSignaturePad(signaturePad) {
            if (signaturePad && signaturePad._canvas) {
                signaturePad.on();
                signaturePad._canvas.style.pointerEvents = 'auto';
            } else {
                console.error('signaturePad أو _canvas غير معرف.');
            }
        }
    } else {
        console.error('عنصر واحد أو أكثر غير موجود في DOM.');
    }
});

// function for hiddening survey_type
document.addEventListener("DOMContentLoaded", function () {
    const surveyType = document.getElementById("survey_type");
    const buildingFields = document.getElementById("building-fields");
    const apartmentFields = document.getElementById("apartment-fields");
    const landFields = document.getElementById("land-fields");

    function handleSurveyTypeChange() {
        const value = surveyType.value;

        // Hide all fields initially
        buildingFields.style.display = "none";
        apartmentFields.style.display = "none";
        landFields.style.display = "none";

        // Show relevant fields based on selected survey type
        // 0==>وحده
        // 10==>وحدة دوبلكس
        // 4==>جراج
        // 18==>وحدة تربلكس
        // 19==>وحدة كوادريبلكس
        // 24==>وحدة بحديقة
        if (value === "0" || value === "10" || value === "4" || value === "18" || value === "19" || value === "24") {
            apartmentFields.style.display = "block";
            // 3==>مبني
            // 5==>مبني بحديقة
            // 4==>(وده عشان يتعامل مع جميع المدخلات الموجوده في الوحدة والمبني )جراج 
            // 15==>فيلا
            // 13==>شالية
        } else if (value === "3" || value === "4" || value === "5" || value === "15" || value === "13") {
            buildingFields.style.display = "block";
            // 1==>ارض مقاسة بالمتر
            // 2==>ارض مقاسة بالفدان

        } else if (value === "1" || value === "2") {
            landFields.style.display = "block";
        } else {
            // إذا لم يكن هناك تطابق مع أي من القيم
            apartmentFields.style.display = "none";
            buildingFields.style.display = "none";
            landFields.style.display = "none";
        }
    }

    // Initial call to set visibility based on default value
    handleSurveyTypeChange();

    // Add event listener to handle changes
    surveyType.addEventListener("change", handleSurveyTypeChange);
});
// الحصول على عنصري القائمتين
const surveyTypeSelect = document.getElementById('survey_type');
const usageSelect = document.getElementById('usage');

// إضافة حدث 'change' للقائمة 'survey_type'
surveyTypeSelect.addEventListener('change', function () {
    const selectedValue = surveyTypeSelect.value; // الحصول على القيمة المختارة

    // تعيين القيمة في قائمة 'usage'
    usageSelect.value = selectedValue;
});



// إدارة القوائم المنسدلة
document.querySelectorAll('.input-top, .input-bottom, .input-left, .input-right').forEach(function (input) {
    input.addEventListener('click', function () {
        const id = this.id.replace('input-', 'dropdown-');
        document.getElementById(id).classList.toggle('show');
    });

    // تحديث العناصر الأخرى عند الكتابة في الحقل
    input.addEventListener('input', function () {
        updateBorderValues(this.id);
    });
});

document.querySelectorAll('.dropdown-content div').forEach(function (option) {
    option.addEventListener('click', function () {
        const inputId = this.parentElement.id.replace('dropdown-', 'input-');
        document.getElementById(inputId).value = this.textContent;

        // تحديث العناصر الأخرى بناءً على الـ input الحالي
        updateBorderValues(inputId);

        this.parentElement.classList.remove('show');
    });
});

window.addEventListener('click', function (event) {
    if (!event.target.matches('.input-top, .input-bottom, .input-left, .input-right')) {
        const dropdowns = document.querySelectorAll('.dropdown-content.show');
        dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
    }
});

// وظيفة لتحديث قيم العناصر الأخرى
function updateBorderValues(changedInputId) {
    const inputTopSelect = document.getElementById('input-top');
    const inputBottomSelect = document.getElementById('input-bottom');
    const inputRightSelect = document.getElementById('input-right');
    const inputLeftSelect = document.getElementById('input-left');

    const northBorderSelect = document.getElementById('north_border');
    const southBorderSelect = document.getElementById('south_border');
    const eastBorderSelect = document.getElementById('east_border');
    const westBorderSelect = document.getElementById('west_border');

    if (changedInputId === 'input-top') {
        northBorderSelect.value = inputTopSelect.value;
    } else if (changedInputId === 'input-bottom') {
        southBorderSelect.value = inputBottomSelect.value;
    } else if (changedInputId === 'input-right') {
        eastBorderSelect.value = inputRightSelect.value;
    } else if (changedInputId === 'input-left') {
        westBorderSelect.value = inputLeftSelect.value;
    }
}


// تعيين التاريخ بشكل automatic
function formatDateToYMD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setCurrentDate() {
    const today = new Date();
    const formattedDate = formatDateToYMD(today);
    document.getElementById('date-input').value = formattedDate;
}

// Call the function to set the current date on page load
setCurrentDate();

// lookups
document.addEventListener('DOMContentLoaded', async () => {
    const governorateId = localStorage.getItem('governorateid');
    const defaultSector = localStorage.getItem('sector');
    const defaultSubSector = localStorage.getItem('ssec');
    const surveyTeamId = localStorage.getItem('surveyTeamId'); // جلب teamId من localStorage
    const sector = document.getElementById('sector');
    const ssec = document.getElementById('ssec');
    const surveyorSelect = document.querySelector('select[name="surveyor-name"]');
    const surveyor2Select = document.querySelector('select[name="surveyor-name2"]'); // تصحيح الاسم هنا

    if (governorateId) {
        try {
            const response = await fetch(`http://localhost:5000/regions/${governorateId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const regions = await response.json();

            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region.regionid;
                option.textContent = region.regionname;
                sector.appendChild(option);
            });

            if (defaultSector) {
                sector.value = defaultSector;
                await loadSubSectors(defaultSector, defaultSubSector);
            }
        } catch (error) {
            console.error('Error fetching regions:', error);
        }
    } else {
        console.warn('No governorateId found in local storage.');
    }

    // Function to load sub-sectors based on selected sector
    async function loadSubSectors(regionId, defaultSubSector) {
        ssec.innerHTML = '<option value="">اختر الشياخة</option>';

        if (regionId) {
            try {
                const response = await fetch(`http://localhost:5000/districts/${regionId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                data.data.forEach(district => {
                    const option = document.createElement('option');
                    option.value = district.id;
                    option.textContent = district.arabicname;
                    ssec.appendChild(option);
                });

                if (defaultSubSector) {
                    ssec.value = defaultSubSector;
                }
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        } else {
            console.log('No region selected.');
        }
    }

    // Event listener for sector change to load sub-sectors
    sector.addEventListener('change', async (event) => {
        const regionId = event.target.value;
        await loadSubSectors(regionId, defaultSubSector);
    });

    // Loading employee names for surveyor-name select based on surveyTeamId
    if (surveyTeamId) {
        try {
            const response = await fetch(`http://localhost:5000/employee/${surveyTeamId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            const employees = result.data; // الوصول إلى مصفوفة الموظفين

            // مسح الخيارات السابقة
            surveyorSelect.innerHTML = '<option value="">اسم القائم بالرفع 1</option>';
            surveyor2Select.innerHTML = '<option value="">اسم القائم بالرفع 2</option>'; // تصحيح الاسم هنا

            // إضافة خيارات الموظفين
            employees.forEach(employee => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');

                option1.value = employee.name; // استخدام رقم الهوية كقيمة
                option1.textContent = employee.name; // اسم الموظف

                option2.value = employee.name;
                option2.textContent = employee.name;

                surveyorSelect.appendChild(option1);
                surveyor2Select.appendChild(option2); // تصحيح الاسم هنا
            });
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    } else {
        console.warn('No surveyTeamId found in local storage.');
    }
});


// // screen for guid electronic
// document.getElementById("screenshotButton").addEventListener("click", function () {
//     var element = document.querySelector('body');

//     domtoimage.toPng(element)
//         .then(function (dataUrl) {
//             var link = document.createElement('a');
//             link.href = dataUrl;
//             link.download = 'screenshot.png';
//             link.click();
//         })
//         .catch(function (error) {
//             console.error('خطأ في التقاط الصورة', error);
//         });
// });


// screen for guid electronic
document.getElementById("exportKroky").addEventListener("click", function () {
    const krokyMap = document.getElementById("krokyMap");
    const requestNumber = document.getElementById("request-number").value; // Get request number

    // Use dom-to-image to take a screenshot of the map
    domtoimage.toBlob(krokyMap, {
        bgcolor: '#ffffff',
        width: krokyMap.offsetWidth * 1,
        height: krokyMap.offsetHeight * 1.2
    }) // Set a background color if needed
        .then(function (blob) {
            // Create FormData object to send the image with key 'kroqui-image' and request number
            const formData = new FormData();
            formData.append('requestNumber', requestNumber); // Add request number
            formData.append('kroqui-image', blob, 'kroky_image.jpg'); // Add image file
            // Get token from localStorage
            const token = localStorage.getItem('token');

            // Send image to the API
            fetch('http://localhost:5000/api/saveData', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Use token from localStorage
                },
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to upload image');
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle response data
                    document.getElementById("responseMessage").innerHTML = "Image uploaded successfully!";
                })
                .catch(error => {
                    // Handle error
                    document.getElementById("responseMessage").innerHTML = "Error uploading image.";
                    console.error('Error:', error);
                });
        });
});



function navigateToGuidnesList() {
    window.location.href = 'guidnesList.html';
}

// set value in input
function updateUsage() {
    var surveyTypeSelect = document.getElementById('survey_type');
    var selectedText = surveyTypeSelect.options[surveyTypeSelect.selectedIndex].text;
    document.getElementById('usage').innerHTML = surveyTypeSelect.options[surveyTypeSelect.selectedIndex].text;
}

//navigate show save btn
document.getElementById('terms-checkbox').addEventListener('change', function () {
    var saveButton = document.getElementById('send-data');
    if (this.checked) {
        saveButton.disabled = false; // Show the button
    } else {
        saveButton.disabled = true; // Hide the button
    }
});


// counter btn for surveyors
// let counter = "+";

// function updateCounter() {
//     if (counter === "+") {
//         document.getElementById('row-surveyor-name').style.display = 'table-row';
//         counter = 1;
//     } else if (counter === 1) {
//         document.getElementById('row-surveyor-name2').style.display = 'table-row';
//         counter = 2;
//     } else if (counter === 2) {
//         document.getElementById('row-surveyor-name').style.display = 'none';
//         document.getElementById('row-surveyor-name2').style.display = 'none';
//         counter = "+";
//     }
//     document.getElementById('counter-button').innerText = counter;
// }