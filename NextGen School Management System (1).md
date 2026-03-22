**NextGen School Management System**

**NextGen School Management System** হলো একটি আধুনিক, স্কেলেবল এবং রোল-বেজড ওয়েব অ্যাপ্লিকেশন যা একটি শিক্ষা প্রতিষ্ঠানের প্রশাসনিক এবং একাডেমিক কার্যক্রমকে ডিজিটালাইজ করার জন্য ডিজাইন করা হয়েছে। **Next.js**, **Node.js**, এবং **PostgreSQL** এর মতো শক্তিশালী টেকনোলজি স্ট্যাক ব্যবহার করে তৈরি এই সিস্টেমটি স্কুলের দৈনন্দিন কাজ যেমন—শিক্ষার্থী ভর্তি, রুটিন প্রণয়ন, হাজিরা নিয়ন্ত্রণ, এবং ফলাফল প্রকাশকে সহজতর করে।

এই প্রজেক্টের মূল বৈশিষ্ট্য হলো এর **Role-Based Access Control (RBAC)**, যা Super Admin, Admin, Teacher এবং Parent-দের জন্য পৃথক ড্যাশবোর্ড এবং নির্দিষ্ট পারমিশন নিশ্চিত করে। এছাড়াও এতে রয়েছে **Stripe Payment Gateway** ইন্টিগ্রেশন, যার মাধ্যমে অভিভাবকরা ঘরে বসেই নিরাপদভাবে টিউশন ফি প্রদান করতে পারেন। একটি ক্লিন UI/UX এবং রেসপনসিভ ডিজাইনের মাধ্যমে এটি শিক্ষা প্রতিষ্ঠানের স্বচ্ছতা এবং কর্মদক্ষতা বৃদ্ধিতে সহায়তা করবে।

## **🚀 Core Features List**

প্রজেক্টের কার্যকারিতাকে ৪টি প্রধান ইউজার রোল এবং টেকনিক্যাল ইমপ্লিমেন্টেশনের ভিত্তিতে ভাগ করা হয়েছে:

### **👤 User Roles & Responsibilities**

#### **1\. Super Admin (Strategic Controller)**

* **Audit Dashboard:** সম্পূর্ণ সিস্টেমের ডাটা ও অ্যাক্টিভিটি পর্যালোচনার কেন্দ্রীয় নিয়ন্ত্রণ।  
* **Admin Management:** স্কুল অ্যাডমিনদের অ্যাকাউন্ট তৈরি, এডিট এবং ডিলিট করার ক্ষমতা।  
* **Revenue Analytics:** Stripe থেকে প্রাপ্ত আয়ের গ্রাফিক্যাল এবং স্ট্যাটিস্টিক্যাল রিপোর্ট।  
* **System Logs:** ডাটাবেসে হওয়া প্রতিটি পরিবর্তনের রেকর্ড বা ট্র্যাকিং।

#### **2\. Admin (Operational Manager)**

* **Academic CRUD:** শিক্ষার্থী ভর্তি এবং শিক্ষকদের প্রোফাইল ম্যানেজমেন্ট।  
* **Structure Setup:** ক্লাস, সেকশন এবং সাবজেক্ট ভিত্তিক ডাটাবেস কনফিগারেশন।  
* **Routine Builder:** প্রতিটি ক্লাসের জন্য ডাইনামিক সাপ্তাহিক ক্লাস রুটিন তৈরি।  
* **Finance Control:** মাসিক/বার্ষিক ফি-এর পরিমাণ নির্ধারণ ও নিয়ন্ত্রণ।  
* **Class-wise Statistics:** (Special Feature) প্রতিটি ক্লাসের ছাত্র-ছাত্রী সংখ্যা, উপস্থিতির হার এবং গড় পারফরম্যান্সের আলাদা ভিউ।

#### **3\. Teacher (Academic Executor)**

* **Digital Attendance:** শিক্ষার্থীদের দৈনিক উপস্থিতির ডাটা সরাসরি ইনপুট দেওয়া।  
* **Gradebook:** পরীক্ষার নম্বর ইনপুট এবং রেজাল্ট শিট প্রসেসিং।  
* **Personal Schedule:** নিজের জন্য বরাদ্দকৃত ক্লাসের সময়সূচী দেখা।  
* **Student Feedback:** নির্দিষ্ট শিক্ষার্থীর উন্নতি বা আচরণের ওপর মন্তব্য প্রদান।

#### **4\. Parent (Guardian Interface)**

* **Child Profile:** সন্তানের একাডেমিক প্রোফাইল এবং ব্যক্তিগত তথ্যের এক্সেস।  
* **Attendance Tracker:** সন্তানের প্রতিদিনের উপস্থিতির রিয়েল-টাইম আপডেট।  
* **Result Portal:** রেজাল্ট কার্ড দেখা এবং PDF ফরম্যাটে ডাউনলোড করার সুবিধা।  
* **Stripe Payments:** অনলাইনে টিউশন ফি এবং অন্যান্য চার্জ পরিশোধ।  
* **Transaction Ledger:** পূর্ববর্তী সকল পেমেন্টের ইনভয়েস এবং হিস্ট্রি দেখা।

### **🛠️ Key Technical Features**

* **Hybrid Authentication:** JWT এবং Better-Auth ব্যবহার করে মাল্টি-লেয়ার সিকিউরিটি।  
* **Smart RBAC:** ইউজার রোল অনুযায়ী অটোমেটিক মেনু ফিল্টারিং এবং এপিআই প্রটেকশন।  
* **Stripe Integration:** সম্পূর্ণ সিকিউর পেমেন্ট গেটওয়ে ইমপ্লিমেন্টেশন।  
* **Advanced Search & Filter:** হাজারো ডাটার মধ্য থেকে দ্রুত নির্দিষ্ট তথ্য খুঁজে পাওয়ার সুবিধা।  
* **Error Management:** ইউজার ফ্রেন্ডলি ফর্ম ভ্যালিডেশন এবং গ্লোবাল এরর হ্যান্ডলিং সিস্টেম। 

# **Database Design Documentation**

* ## **Overview**

  * এই প্রজেক্টে একটি **Relational Database Model** ব্যবহার করা হয়েছে। সিস্টেমটি **Role-Based Access Control (RBAC)** এবং **Database Normalization (3NF)** নীতি অনুসরণ করে ডিজাইন করা হয়েছে। এর ফলে ডাটা ডুপ্লিকেশন হ্রাস পাবে এবং কমপ্লেক্স কুয়েরি পারফরম্যান্স বৃদ্ধি পাবে। এটি মূলত PostgreSQL ডাটাবেস এবং Prisma ORM-এর সমন্বয়ে গঠিত।

* ## **Core Architectural Patterns**

  * সিস্টেমটি ডাটা ম্যানেজমেন্টের জন্য ৩টি প্রধান আর্কিটেকচারাল প্যাটার্ন অনুসরণ করে:  
  * **Shared User Identity:** একটি কেন্দ্রীয় `User` টেবিল যা সকল রোলের (Super Admin, Admin, Teacher, Parent) অথেন্টিকেশন হ্যান্ডেল করে।  
  * **Profile Separation:** প্রতিটি রোলের জন্য আলাদা প্রোফাইল টেবিল ব্যবহার করা হয়েছে যাতে ডাটাবেস ক্লিন থাকে।  
  * **Bridge Tables:** Many-to-Many রিলেশন ম্যানেজ করার জন্য জংশন টেবিল ব্যবহার করা হয়েছে।

* ### **Role-Based Profile Tables (1:1 Relationships)**

  * ইউজার টেবিলের সাথে সংযুক্ত এই টেবিলগুলো নির্দিষ্ট রোলের অতিরিক্ত তথ্য ধারণ করে:  
    * **Admin Table:** অফিসের স্টাফ বা প্রধান শিক্ষকের তথ্য (Designation, Office ID)।  
    * **Teacher Table:** শিক্ষকদের স্পেশালাইজেশন, জয়েনিং ডেট এবং বায়োডাটা।  
    * **Parent Table:** অভিভাবকের ফোন নম্বর, এনআইডি (NID) এবং স্থায়ী ঠিকানা।

* **Academic & Operational Tables**  
  * Student Table: এটি একটি ডাটা এন্ট্রি টেবিল। এর সাথে `Parent` (N:1) এবং `Class` (N:1) এর সরাসরি সম্পর্ক রয়েছে।  
    * Class Table: এখানে ক্লাসের নাম, সেকশন এবং নির্ধারিত মাসিক ফি (Monthly Fee) সংরক্ষিত থাকে।  
    * Attendance Table: প্রতিদিনের উপস্থিতি ট্র্যাকিং (`studentId`, `date`, `status`)।  
    * Result Table: শিক্ষার্থীর পরীক্ষার ফলাফল (`studentId`, `subjectId`, `marks`, `grade`)।

* ## **Complex Relationships (Bridge Tables)**

  জটিল লজিক্যাল রিলেশনগুলো হ্যান্ডেল করতে নিচের ব্রিজ টেবিলগুলো ব্যবহার করা হয়েছে:

| Table Name | Logic | Description |
| :---- | :---- | :---- |
| **ClassTeacher** | Many-to-Many | একজন শিক্ষক একাধিক ক্লাসে পড়াতে পারেন। |
| **ClassSubject** | Many-to-Many | একটি নির্দিষ্ট ক্লাসে কোন কোন বিষয়গুলো থাকবে তা নির্ধারণ করে। |

	

* ## **Financial Data (Stripe Integration)**

  * পেমেন্ট ট্র্যাকিংয়ের জন্য একটি ডেডিকেটেড **Payment Table** ব্যবহার করা হয়েছে:  
  * **Fields:** `transactionId`, `amount`, `paymentStatus`, `studentId`, `parentId`.  
  * **Workflow:** অভিভাবক যখন Stripe-এর মাধ্যমে ফি প্রদান করবেন, সিস্টেম অটোমেটিক এই টেবিলে একটি সাকসেসফুল এন্ট্রি তৈরি করবে।


* ## **Strategic Design Choices**

  * **Soft Delete:** ডেটাবেস থেকে কোনো রেকর্ড স্থায়ীভাবে মোছা হবে না। `isDeleted: true` ফ্ল্যাগ ব্যবহার করে ডাটা হাইড করা হবে, যা ভবিষ্যতে অডিট ট্রেইল (Audit Trail) হিসেবে কাজ করবে।  
  * **Optimized Indexing:** `studentId` এবং `classId` এর ওপর ইনডেক্সিং করা হয়েছে যাতে অ্যাডমিন ড্যাশবোর্ডের **Class-wise Statistics** দ্রুত জেনারেট করা যায়।  
  * **Referential Integrity:** Prisma-র মাধ্যমে Foreign Key কনস্ট্রেইন নিশ্চিত করা হয়েছে যাতে ভুলবশত রিলেটেড ডাটা ডিলিট না হয়।

### **👤১. কোর অথেন্টিকেশন টেবিল (Better-Auth)**

এই টেবিলগুলো মূলত ইউজার লগইন এবং সেশন হ্যান্ডেল করবে।

1. **User Table:** এটি সিস্টেমের প্রধান টেবিল। এখানে `role`, `status`, `isDeleted` ইত্যাদি ফিল্ড থাকবে।  
2. **Session Table:** ইউজারের লগইন সেশন ট্রাক করার জন্য (Better-Auth অটো জেনারেট করে)।  
3. **Account Table:** সোশ্যাল লগইন (যদি থাকে) বা ক্রেডেনশিয়াল স্টোর করার জন্য।

---

### **👤 ২. প্রোফাইল টেবিল (Role-Specific)**

ইউজার টেবিলের সাথে এগুলো **1:1 Relationship**\-এ থাকবে।

4. **Admin Table:** সুপার অ্যাডমিন বা জেনারেল অ্যাডমিনের অতিরিক্ত তথ্য (যেমন: পদবী)।  
5. **Teacher Table:** শিক্ষকের প্রোফাইল, বায়ো, এবং জয়েনিং ডেট।  
6. **Parent Table:** অভিভাবকের ফোন নম্বর এবং ঠিকানা। এটি স্টুডেন্টদের সাথে যুক্ত থাকবে।

---

### **🎓 ৩. একাডেমিক টেবিল (Core School Logic)**

এই টেবিলগুলো স্কুলের মূল কার্যক্রম পরিচালনা করবে।

7. **Student Table:** শিক্ষার্থীদের তথ্য। এটি কোনো ইউজার টেবিল নয়, বরং একটি ডাটা টেবিল যা `Parent` এবং `Class` এর সাথে **N:1** রিলেশনে থাকবে।  
8. **Class Table:** ক্লাসের নাম (Class 1, 2...), সেকশন এবং এই ক্লাসের মাসিক ফি-এর পরিমাণ।  
9. **Subject Table:** বিষয়ের নাম (যেমন: গণিত, বাংলা, ইংরেজি)।

---

### **🌉 ৪. ব্রিজ টেবিল (Many-to-Many Relationships)**

জটিল সম্পর্কগুলো হ্যান্ডেল করার জন্য এই জংশন টেবিলগুলো প্রয়োজন।

10. **ClassTeacher Table:** কোন শিক্ষক কোন কোন ক্লাসে পড়াবেন তা নির্ধারণ করবে।  
11. **ClassSubject Table:** কোন ক্লাসে কোন কোন বিষয়গুলো সিলেবাসে আছে তা নির্ধারণ করবে।

---

### **📝 ৫. অপারেশনাল এবং ট্রানজ্যাকশন টেবিল**

দৈনন্দিন ইনপুট এবং পেমেন্টের জন্য।

12. **Attendance Table:** শিক্ষার্থীদের প্রতিদিনের উপস্থিতির রেকর্ড।  
13. **Result Table:** বিষয়ভিত্তিক পরীক্ষার নম্বর এবং গ্রেড।  
14. **Payment Table:** অভিভাবকদের করা ফি পেমেন্টের রেকর্ড (Stripe Transaction ID সহ)।  
15. **Notice Table:** স্কুল থেকে দেওয়া নোটিশগুলো স্টোর করার জন্য।

**API Documentation**

**🏛️ ১. User Management (অ্যাডমিন মডিউল)**

যেহেতু ইউজাররা অলরেডি রেজিস্টার্ড, এখন শুধু তাদের পরিচালনা করা:

* **GET** `/api/users`: সকল ইউজারের লিস্ট (Search, Filter by Role, Pagination)।  
* **GET** `/api/users/:id`: নির্দিষ্ট ইউজারের বিস্তারিত (যেমন: একজন শিক্ষকের ক্লাসের তালিকা বা একজন অভিভাবকের সন্তানদের তালিকা)।  
* **PATCH** `/api/users/:id`: ইউজারের তথ্য আপডেট (নাম, ফোন, পাসওয়ার্ড চেঞ্জ ফ্ল্যাগ)।  
* **DELETE** `/api/users/:id`: ইউজারের **Soft Delete** করা।

### **🏫 ২. Academic Infrastructure (ক্লাস ও সাবজেক্ট)**

* **CRUD** `/api/classes`: ক্লাস তৈরি ও পরিচালনা।  
* **CRUD** `/api/subjects`: সাবজেক্ট তৈরি ও পরিচালনা।  
* **POST** `/api/classes/assign-subject`: নির্দিষ্ট ক্লাসে সাবজেক্ট সেট করা (`ClassSubject` ব্রিজে ডাটা পাঠানো)।  
* **POST** `/api/classes/assign-teacher`: নির্দিষ্ট ক্লাসে শিক্ষক বা ক্লাস টিচার নিয়োগ দেওয়া।

### **👶 ৩. Student & Promotion (শিক্ষার্থী ব্যবস্থাপনা)**

* **POST** `/api/students`: নতুন শিক্ষার্থী ভর্তি (যেহেতু স্টুডেন্টদের নিজস্ব লগইন নেই, অ্যাডমিন এটি করবেন)।  
* **GET** `/api/students`: ক্লাস-ভিত্তিক শিক্ষার্থীর তালিকা।  
* **PATCH** `/api/students/:id/promote`: আপনার সেই **Performance-based Promotion** লজিক। এখানে চেকলিস্ট ভ্যালিডেশন হবে।

### **📝 ৪. Academic Operations (টিচার মডিউল)**

* **POST** `/api/attendance`: প্রতিদিনের হাজিরা ইনপুট।  
* **GET** `/api/attendance/report`: নির্দিষ্ট মাস বা তারিখের হাজিরার সামারি।  
* **POST** `/api/results`: পরীক্ষার নম্বর এন্ট্রি দেওয়া।  
* **GET** `/api/results/report-card/:studentId`: একটি ডিজিটাল রিপোর্ট কার্ড জেনারেট করা।

### **💰 ৫. Payment & Communication (প্যারেন্ট ও অ্যাডমিন)**

* **GET** `/api/payments/dues`: কোন কোন শিক্ষার্থীর মাসিক ফি বাকি আছে তার লিস্ট।  
* **POST** `/api/payments/checkout`: Stripe সেশন তৈরি করা।  
* **POST** `/api/notices`: নোটিশ পাবলিশ করা (Target Audience অনুযায়ী)।

### **📊 ৬. Analytics (অ্যাডমিন ড্যাশবোর্ড)**

* **GET** `/api/dashboard/stats`: (টোটাল স্টুডেন্ট, টিচার, কালেকশন, এবং অ্যাটেনডেন্স পার্সেন্টেজ)।

src

├── app

│   ├── (commonLayout)           \# Public Landing, About, Contact

│   │   ├── login

│   │   │   ├── \_components

│   │   │   │   └── LoginForm.tsx

│   │   │   └── page.tsx

│   │   ├── layout.tsx

│   │   └── page.tsx

│   ├── (dashboard)              \# Main Dashboard Group

│   │   ├── (commonProtectedLayout) \# Shared across all roles (Admin/Teacher/Parent)

│   │   │   ├── change-password

│   │   │   │   └── page.tsx

│   │   │   ├── forget-password   \<-- New Route

│   │   │   │   ├── \_components

│   │   │   │   │   └── ForgetPasswordForm.tsx

│   │   │   │   └── page.tsx

│   │   │   ├── verify-otp        \<-- New Route

│   │   │   │   ├── \_components

│   │   │   │   │   └── OtpInputGroup.tsx

│   │   │   │   └── page.tsx

│   │   │   ├── my-profile

│   │   │   │   └── page.tsx

│   │   │   └── layout.tsx        \# Common Sidebar/Navbar Logic

│   │   ├── admin                \# Admin specific features

│   │   │   ├── students

│   │   │   ├── teachers

│   │   │   └── page.tsx

│   │   ├── teacher              \# Teacher specific features

│   │   │   ├── attendance

│   │   │   ├── marks-entry

│   │   │   └── page.tsx

│   │   └── layout.tsx           \# Global Dashboard Wrapper

├── components

│   ├── modules

│   │   └── auth                 \# Shared Auth Components (OTP, Verification)

│   ├── shared

│   │   ├── form

│   │   │   ├── AppInput.tsx     \# Reusable Form Input

│   │   │   └── SubmitButton.tsx

│   │   └── DataTable.tsx

│   └── ui                       \# shadcn/ui (Button, Input, OTP-Input)

├── services                     \# API Handlers

│   ├── auth.service.ts          \# verifyOtp, resetPassword calls

│   └── user.service.ts

├── zod                          \# Validations

│   └── auth.validation.ts       \# OTP & Password schemas

└── lib

    └── axios.ts                 \# Axios Instance

