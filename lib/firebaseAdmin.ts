import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.merj-d69bf,
        clientEmail: process.env.firebase-adminsdk-fbsvc@merj-d69bf.iam.gserviceaccount.com,
        privateKey: process.env.-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUXKee9KNQGm94\nf2Fe6fecdpp2JL84Vohzep3NS6DVuhKKEOAmcOkQqkpn5o6dOAh4DWeY0HWCaQ5I\ny9KaGBv0kbszDeeDIp9PmrhxFytp2y94FpLN8k8tKNn62nng68SNVqbsNp+C8mQF\nAe6tp+khlsGtAxvi7jTmqfL0TFEPdMVufSbKfutU2V3pvHBN2EAtg2fDC5QQVAiW\nXH0sOE9rxsLiKRb0BCA2NQ/bmS5AddoAZ0PfiFietMbnCx6QMfnh3UeCeMiyC047\nlFn7bHf1GziOtxChiemqzmo/FtzA3InF8e8YOOrirI2VQdKmhzWGSrAWcpwJvYQt\nXTHR6rHXAgMBAAECggEAGbJrN3PjkzIvt5q1CKGH10S5eimw2JC4Cuk/0R4hWdtz\nRNu36U7pFPLWSsOpEY3nOx0Rd89keMxc8HghhYinUVfqbsoe7/evjsK/0NzR4bRR\nMSyMxSOuFbPcygXH5myr0xffiQkvEiRh8AKE2Y9OSZnkLnBdiSnz+CQr2bNRF8J8\nEyqarMm1Q5ZSEzvRbRD30VrqaDWOpMrYYBUWk8oRZSsZw9ShP9mH7EuEPucSm3nr\nPd3tuovoz5rfqAUqBW/HWRJUqJQSbkTr0Zr6Y2YoIwOZVuFBnuz0vVJv1E6ZdSEH\nydqgApSasMcojyL6yNu44G4B+bWivjj3VhMxpzA3kQKBgQD0I0aR0LaQXaRFJ6k5\nnNnrb1XACbrRJ8X0sQ7aJZ4dpxDxMn5P5fKf/xtcZVLycCxvEXqKYu/BEE/97X47\ngzHberGQ3OcrWPcI1OjjrBoKm2mHOqsJEcYLs/eMsWunFwe1fJOaM0CdEHLlgB9J\nRFlBv4JOo0smUl/zhg5rF8pTGQKBgQDeriIGJAE2IlZutzBinnOO6e2H8cl8mYEY\nZVj0+xFhju927LgusbKaCPTckFji7Q3FdNqCcVz30ArJonYxJBPArJtncU26JznM\n6TMbi3GwtGxfrIVj7vnMTuhClHzfTzaZw8EdwGssR4+qAojLhaEbh/pqAK/lwgGR\nPnlMneU6bwKBgQC0BRLzUIhd+X64s58X6W3TKhx753DG62IPpUODXfuyd8+JWydC\nuRdoHQ9K2TgJpudM2wGV65BIt0OUxTuwnHP2GAm4/PrEvuwhqgU0ZGIrch+lZIBb\nxqxXUtP1/ZmY8uVvULXyHVrGtitSyV/IgcqjLZjjbYtrbZBtHGujUj6ReQKBgDvG\n8RlG5xBaLWuxP4rp0EmoIHyi+py5NH+RDU1ObL8MuNnq+BKI31IcX2cqVMIuMskz\n8kicGAHqVksEksfkUG0jqOAe+Wekig6o93BIga+W75TLYk+OYn5nHFBrPg5QXG7w\nrtHGyr5rQ3S3E3PXHoWefimgn5eE+hi8daGMrXF/AoGAROLRkn4XrntwEIsuzPai\nUM32eJJctEQE6ah2kp8rtSjiozWRQpTsZZpEKlWS1qY/gXnVJmNpKmd+fTLonRXY\n5QrIA4coB81Mjj3A4i4WWoQFvOsljMWcSYUqVGqJF7/QMDLCUg9YyoY3QU3jTCrv\nF84jZ7xVx9JeXzCISMkMfIc=\n-----END PRIVATE KEY-----\n",
      }),
    })

export const adminAuth = getAuth(app)
