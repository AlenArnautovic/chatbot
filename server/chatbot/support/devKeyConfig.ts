/**
 * by Nicolai Haferkamp
 *
 * Based on: https://www.youtube.com/watch?v=F2ibS4gcglY
 *
 * To connect the Server to the right dialogflow Agent the following fields need to be adapted:
 */
export const devKeys = {
  //Name of field in downloaded JSON from Dialogflow: type
  type: 'service_account',
  //Name of field: project_id
  googleProjectId: 'doctorsappointment-lhpq',
  //Name of field: private_key_id
  googlePrivateKeyId: 'e1745dab6d5bed2afb437de560ba0c6becbbc65f',
  //Name of field: private_key
  googlePrivateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDYVe8sY8tP9m0+\nre/kxxeDo/bNQ7fmESPVjmqErAt+Nj47QBRCFemwsNej+ChZ2yN28TpHx+bxnYrQ\n3hIG1gPgLqR1H9Z2V3CqQ5ebb0dKoovEIsq+ULp3gYCPEhEaWXm9bV2caJJVSURF\nQwVRFRPBISf4Ib/RVypmnn94b72wZGXN6UcCNjqgkMHY2rWv+KLxfolcrDCuFVzE\nJx0u4h0QfUCqj+IJ3E2nenv7y1e0HfMvVOuqSopm7OGRLBJ5khlfZQpJN51Ez5rV\n+DxJ1JpCkw38WfwE4n6uIA4Rvpg21/SypFg3oGDHIbUmsElCRkWrgz6SzQfUwndw\nQT7wXUFFAgMBAAECggEAWwNANYEgcloemK2NjMaTpm6vMKkKL5DLbhdVyc4loaoJ\nYVzyiOD2KT8k4ZdPxonScEJJPhSkHMcmNPwQQm78P27wAlRsIepkfEUmfZ6BtC0R\nNulaOVn2MLu7TbWQm3DELkTaCqjV02qY/biV/ogrAOfFjHcKX3RX4sdQomcEOzYj\nfxdl8uv5QBurdNXx7DU6cyoYCcAEzh1rHyZXvQI3F6SbpmTGl2p7aVKs63AacOVs\nUT+2aafvDwCmYLzKCQtUn0yKgyOk+APyAQjxIFzsPqzCdyc3CGingHm/M2YDMZeG\nojg6u4WOkRZ4o94uxXc+3lk9tL3zraSECI9aX6LNiwKBgQD217yXrjxkRFE777p6\n+Bxu1oDg3jnUALdl8J/yQFacVzm7sVXuvK8nDAyqZXfSW1mfs407ltSCsTbn67na\nr7P+XFQlsviEsGTQpt5ZDqnHedV9Tztxin/FhRc/blQX5PqG96QuQsiEEDxqL3ug\nZ0XLZAIEilaBqAJTGGZKFkYHawKBgQDgXHjzegH/SaMfRSZjNV0KP/e/Fe4e4Bay\nAW7hGpo6UmYIlBJ5vuqUTlXRylmAY3p1LB/JWwMma51w2PZP99WAX+QI0Kp5t6iy\nburGN6vJItw0RMJp9zX06/JHvsgL2ACptX71qUeT7tnf96X8Woj+7YmJRV7sKhpA\nMoRVR+b2DwKBgQDAMPtbEkNdQkAJrb8BTbs9pXAVJZHa+m/RREgU43lMIzIFbK7e\nwjSR73TRG03vEEc47CET+30dAQQiEUzU86bubk7qR23uSjVErBhFOQCCGt9ZwN4k\nqlSPou+V6L47GILjoV9I0aC0CrwvZScZni8ejJBxnpB6RSkCL+Y82xjNXwKBgAr+\nHOL5CF4EspxWnAHiXHOjHLVdErSqkBIapd8bmZDf9qXW82zJoN6xU90ah/YVaauS\nBOCtt+LLBQTBbJgQcYJ/sEGKT7/08qwDaTdbBOyu65EYCVp9xUQBx3Yib9S8uZOX\nE+hfaeVin4QssxJBMVMkOkfigTsa+PxKPVecVUGbAoGALww5G1g/lvhtM4UDdNw7\n5msNyHZf+SPEIUsSzg48Mj66sTJwicQkSxZ3XCStAXzUe8qQrgunw5j77xY17r30\nkdy4tPysKEk59dEYepEbH6Pd6RMuv0TajVxetutLLmlR789QUZjxEPNFuQOv3w7x\n0RJxicUZm9PseIYW0QUF7eA=\n-----END PRIVATE KEY-----\n',
  //Name of field: client_email
  googleClientEmail:
    'doctors-appointment-server@doctorsappointment-lhpq.iam.gserviceaccount.com',
  //This doesnt need to be changed-> Language Should be: en-US!
  dialogFlowSessionLanguageCode: 'en-US',
  //Name of field: client_id
  client_id: '109371303142956663437',
  //Name of field: auth_uri
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  //Name of field: token_uri
  token_uri: 'https://oauth2.googleapis.com/token',
  //Name of field: auth_provider_x509_cert_url
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  //Name of field: client_x509_cert_url
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/doctors-appointment-server%40doctorsappointment-lhpq.iam.gserviceaccount.com',
};
