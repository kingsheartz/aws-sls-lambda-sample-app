const tableSchema = {
    StudyInstanceUID: {
        Tag: "0020000D",
        VR: "UI",
        Name: "Study Instance UID",
        Keyword: "StudyInstanceUID",
        PrimaryKey: "studyInstanceUID",
        PathToValue: "[0020000D].Value[0]",

        Level: {
            study: {
                FilterExpression: "#keyData.#key0020000D.#keyValue[0], :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key0020000D": "0020000D",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            series: {
                FilterExpression: "#keyData.#key0020000D.#keyValue[0], :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key0020000D": "0020000D",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            instance: {
                FilterExpression: "#keyData.#key0020000D.#keyValue[0], :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key0020000D": "0020000D",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
        },
        ExpressionAttributeValues: {
            Key: ":value",
        },
        SearchCriteria: "MultiSearch",
    },
    SeriesInstanceUID: {
        Tag: "0020000E",
        VR: "UI",
        Name: "Series Instance UID",
        Keyword: "SeriesInstanceUID",
        PrimaryKey: "seriesInstanceUID",
        PathToValue: "[0020000E].Value[0]",

        Level: {
            study: {
                FilterExpression: "#keyData.#key0020000E.#keyValue[0], :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key0020000E": "0020000E",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            series: {
                FilterExpression: "#keyData.#key0020000E.#keyValue[0], :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key0020000E": "0020000E",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            instance: {
                FilterExpression: "#keyData.#key0020000E.#keyValue[0], :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key0020000E": "0020000E",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
        },
        ExpressionAttributeValues: {
            Key: ":value",
        },
        SearchCriteria: "MultiSearch",
    },
    SOPInstanceUID: {
        Tag: "00080018",
        VR: "UI",
        Name: "SOP Instance UID",
        Keyword: "SOPInstanceUID",
        PrimaryKey: "sopInstanceUID",
        PathToValue: "[00080018].Value[0]",

        Level: {
            study: {
                FilterExpression: "#keyData.#key00080018.#keyValue[0], :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080018": "00080018",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            series: {
                FilterExpression: "#keyData.#key00080018.#keyValue[0], :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080018": "00080018",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            instance: {
                FilterExpression: "#keyData.#key00080018.#keyValue[0], :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080018": "00080018",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
        },
        ExpressionAttributeValues: {
            Key: ":value",
        },
        SearchCriteria: "MultiSearch",
    },
    PatientName: {
        Tag: "00100010",
        VR: "PN",
        Name: "Patient's Name",
        Keyword: "PatientName",
        PathToValue: "[00100010].Value[0].Alphabetic",
        Level: {
            study: {
                FilterExpression: "contains(#patientName, :value00100010)",
                ExpressionAttributeNames: {
                    "#patientName": "patientName",
                },
                CaseInsensitive: true,
            },
            series: {
                FilterExpression: "contains(#keyData.#key00100010.#keyValue[0].#keyAlphabetic, :value00100010)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00100010": "00100010",
                    "#keyAlphabetic": "Alphabetic",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            instance: {
                FilterExpression: "contains(#keyData.#key00100010.#keyValue[0].#keyAlphabetic, :value00100010)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00100010": "00100010",
                    "#keyAlphabetic": "Alphabetic",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
        },
        ExpressionAttributeValues: {
            Key: ":value00100010",
        },
        SearchCriteria: "Default",
        CaseInsensitive: true,
    },
    PatientID: {
        Tag: "00100020",
        VR: "LO",
        Name: "Patient ID",
        Keyword: "PatientID",
        PathToValue: "[00100020].Value[0]",

        Level: {
            study: {
                FilterExpression: "contains(#keyData.#key00100020.#keyValue[0], :value00100020)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00100020": "00100020",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            series: {
                FilterExpression: "contains(#keyData.#key00100020.#keyValue[0], :value00100020)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00100020": "00100020",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            instance: {
                FilterExpression: "contains(#keyData.#key00100020.#keyValue[0], :value00100020)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00100020": "00100020",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
        },
        ExpressionAttributeValues: {
            Key: ":value00100020",
        },
        SearchCriteria: "Default",
    },
    StudyDate: {
        Tag: "00080020",
        VR: "DA",
        Name: "Study Date",
        Keyword: "StudyDate",
        PathToValue: "[00080020].Value[0]",

        Level: {
            study: {
                FilterExpression: "(#keyData.#key00080020.#keyValue[0] BETWEEN :valueStartDate and :valueEndDate)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080020": "00080020",
                    "#keyValue": "Value",
                },
            },
            CaseInsensitive: false,
            series: {
                FilterExpression: "(#keyData.#key00080020.#keyValue[0] BETWEEN :valueStartDate and :valueEndDate)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080020": "00080020",
                    "#keyValue": "Value",
                },
            },
            CaseInsensitive: false,
            instance: {
                FilterExpression: "(#keyData.#key00080020.#keyValue[0] BETWEEN :valueStartDate and :valueEndDate)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080020": "00080020",
                    "#keyValue": "Value",
                },
            },
            CaseInsensitive: false,
        },
        ExpressionAttributeValues: {
            Key1: ":valueStartDate",
            Key2: ":valueEndDate",
        },
        SearchCriteria: "DateRange",
    },
    ModalitiesInStudy: {
        Tag: "00080061",
        VR: "CS",
        Name: "Modalities in Study",
        Keyword: "ModalitiesInStudy",
        PathToValue: "[00080061].Value[0]",

        Level: {
            study: {
                FilterExpression: "contains(#keyData.#key00080061.#keyValue[0], :value00080061)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080061": "00080061",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            series: {
                FilterExpression: "contains(#keyData.#key00080061.#keyValue[0], :value00080061)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080061": "00080061",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            instance: {
                FilterExpression: "contains(#keyData.#key00080061.#keyValue[0], :value00080061)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080061": "00080061",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
        },
        ExpressionAttributeValues: {
            Key: ":value00080061",
        },
        SearchCriteria: "MultiSearch",
    },
    Modality: {
        Tag: "00080060",
        VR: "CS",
        Name: "Modality",
        Keyword: "Modality",
        PathToValue: "[00080060].Value[0]",

        Level: {
            study: {
                FilterExpression: "#keyData.#key00080060.#keyValue, :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080060": "00080060",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            series: {
                FilterExpression: "#keyData.#key00080060.#keyValue, :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080060": "00080060",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            instance: {
                FilterExpression: "#keyData.#key00080060.#keyValue, :value",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080060": "00080060",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
        },
        ExpressionAttributeValues: {
            Key: ":value",
        },
        SearchCriteria: "MultiSearch",
    },
    AccessionNumber: {
        Tag: "00080050",
        VR: "SH",
        Name: "Accession Number",
        Keyword: "AccessionNumber",
        PathToValue: "[00080050].Value[0]",

        Level: {
            study: {
                FilterExpression: "contains(#keyData.#key00080050.#keyValue[0], :value00080050)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080050": "00080050",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            series: {
                FilterExpression: "contains(#keyData.#key00080050.#keyValue[0], :value00080050)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080050": "00080050",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
            instance: {
                FilterExpression: "contains(#keyData.#key00080050.#keyValue[0], :value00080050)",
                ExpressionAttributeNames: {
                    "#keyData": "metadata",
                    "#key00080050": "00080050",
                    "#keyValue": "Value",
                },
                CaseInsensitive: false,
            },
        },
        ExpressionAttributeValues: {
            Key: ":value00080050",
        },
        SearchCriteria: "Default",
    },
    StudyDescription: {
        Tag: "00081030",
        VR: "LO",
        Name: "Study Description",
        Keyword: "StudyDescription",
        PathToValue: "[00081030].Value[0]",
    },
    SeriesDate: {
        Tag: "00080021",
        VR: "DA",
        Name: "Series Date",
        Keyword: "SeriesDate",
        PathToValue: "[00080021].Value[0]",
    },
    SeriesDescription: {
        Tag: "0008103E",
        VR: "LO",
        Name: "Series Description",
        Keyword: "SeriesDescription",
        PathToValue: "[0008103E].Value[0]",
    },
};

module.exports = tableSchema;
