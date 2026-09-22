# Backend Category Setup & Verification Guide

এই গাইডটিতে আপনার ব্যাকএন্ড সার্ভারে ডায়নামিক ক্যাটাগরি যুক্ত করা এবং **ক্যাটাগরি ডিলিট করার সুবিধা** কীভাবে কার্যকর করবেন তা বিস্তারিত বলা হলো।

---

## ১. Backend এ যা যা করতে হবে

### ধাপ ১: Mongoose Item Model চেক করুন
আপনার ব্যাকএন্ড ফোল্ডারের `shey-pos-server/models/itemModel.js` (বা `itemsModel.js`) ফাইলে যান।

**বর্তমান কোড চেক করুন:**
যদি `category` ফিল্ডে কোনো `enum` দেওয়া থাকে, তবে সেটি মুছে ফেলুন:

```javascript
// ❌ পূর্বে যদি এমন সীমাবদ্ধতা (enum) থাকে:
category: {
  type: String,
  enum: ['fruits', 'vegetables', 'meat'], // এটি থাকলে নতুন ক্যাটাগরি সেভ হতে দেবে না
  required: true
}

// ✅ পরিবর্তন করে সাধারণ String বানিয়ে দিন:
category: {
  type: String,
  required: true,
  trim: true
}
```
> **কেন?** সাধারণ `String` থাকলে ইউজার ফ্রন্টএন্ড থেকে যেকোনো নতুন ক্যাটাগরি (যেমন: `Dairy`, `Bakery`, `Beverages`, `Snacks`) পাঠালে মঙ্গোডিবি কোনো বাধা ছাড়াই সেভ করবে।

---

### ধাপ ২: Category Deletion API যোগ করুন (গুরুত্বপূর্ণ)
আপনার ব্যাকএন্ডের `routes/itemsRoute.js` (বা আইটেমের রাউট ফাইলে) নিচের রাউটটি যোগ করুন:

```javascript
// POST /api/items/delete-category
// ইউজার যখন কোনো ক্যাটাগরি ডিলিট করবে, তখন সেই ক্যাটাগরির প্রোডাক্টগুলো নিরাপদে 'general' ক্যাটাগরিতে আপডেট হবে
router.post('/delete-category', async (req, res) => {
  try {
    const { category, targetCategory = 'general' } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // ওই ক্যাটাগরির সকল প্রোডাক্টের ক্যাটাগরি পরিবর্তন করে 'general' করে দেওয়া
    const result = await Item.updateMany(
      { category: { $regex: new RegExp(`^${category}$`, 'i') } },
      { $set: { category: targetCategory } }
    );

    res.status(200).send({
      message: `Category "${category}" deleted successfully. ${result.modifiedCount} items moved to "${targetCategory}".`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json(error);
  }
});
```

*(যদি আপনার আলাদা Category মডেল থেকে থাকে, তবে সেখানেও `await Category.deleteOne({ name: category });` কল করতে পারেন)*

---

### ধাপ ৩: (ঐচ্ছিক) ইউনিক ক্যাটাগরির তালিকা পাওয়ার API
```javascript
// GET /api/items/get-categories
router.get('/get-categories', async (req, res) => {
  try {
    const categories = await Item.distinct('category');
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});
```

---

## ২. ফ্রন্টএন্ডে কী কী সুবিধা যুক্ত করা হয়েছে?

1. **[src/pages/Items.jsx](file:///c:/Sharif/Shey-POS-client-application/src/pages/Items.jsx):**
   - **Manage Categories বাটন:** পেজ হেডারে এবং স্ট্যাটাস কার্ডে **"Manage Categories"** বাটন যুক্ত করা হয়েছে।
   - **Category Management Modal:**
     - এতে সব ক্যাটাগরির তালিকা দেখা যাবে।
     - কোন ক্যাটাগরিতে কয়টি প্রোডাক্ট আছে তা পাশে ব্যাজ আকারে দেখতে পারবেন (যেমন: `5 Products`)।
     - যেকোনো ক্যাটাগরির পাশে থাকা **"Delete"** বাটনে ক্লিক করে কনফার্ম করলেই ক্যাটাগরি ডিলিট হয়ে যাবে।
     - ক্যাটাগরি ডিলিট হলে প্রোডাক্ট হারিয়ে যাবে না, প্রোডাক্টগুলো স্বয়ংক্রিয়ভাবে `General` ক্যাটাগরিতে চলে যাবে।
     - উপর থেকেই নতুন যেকোনো ক্যাটাগরি লিখে দ্রুত যোগ করা যাবে।
   - **অ্যাড/এডিট মডালে লিংক:** প্রোডাক্ট তৈরির ড্রপডাউনের ভেতরেও "Manage / Delete Categories" লিংক দেওয়া আছে।
   - **স্মার্ট ফলব্যাক:** ব্যাকএন্ডে এখনো নতুন ডিলিট এন্ডপয়েন্ট না বসালেও ফ্রন্টএন্ড নিজে থেকেই প্রোডাক্টগুলোকে `general`-এ রিয়াসাইন করে দেবে!

2. **[src/pages/Homepage.jsx](file:///c:/Sharif/Shey-POS-client-application/src/pages/Homepage.jsx):**
   - ডাটাবেজের সব ইউনিক ক্যাটাগরি নিজে থেকেই হোমপেজে ফিল্টার বার-এ কার্ড আকারে রেন্ডার হবে।
   - কোনো ক্যাটাগরি ডিলিট করা হলে হোমপেজ থেকেও সেই ক্যাটাগরি বাটন স্বয়ংক্রিয়ভাবে রিমুভ হয়ে যাবে।

---

## ৩. কীভাবে টেস্ট বা চেক করবেন (Verification Steps)

১. **ক্যাটাগরি ম্যানেজমেন্ট মোডাল ওপেন করুন:**
   - ব্রাউজারে `http://localhost:5173/items` পেজে যান।
   - হেডারে থাকা **"Manage Categories"** বাটনে ক্লিক করুন (অথবা বেগুনি রঙের **Active Categories** কার্ডে ক্লিক করুন)।

২. **নতুন ক্যাটাগরি তৈরি করুন:**
   - ইনপুট বক্সে লিখুন (যেমন: `Beverages` বা `Cosmetics`) এবং **"Add Category"** বাটনে ক্লিক করুন।
   - ক্যাটাগরিটি তালিকায় দেখতে পাবেন।

৩. **ক্যাটাগরি ডিলিট টেস্ট করুন:**
   - তালিকায় থাকা যেকোনো ক্যাটাগরির ডানপাশে থাকা লাল **"Delete"** বাটনে ক্লিক করুন।
   - কনফার্মেশন পপআপে **"Yes, Delete"** ক্লিক করুন।
   - সাথে সাথে ক্যাটাগরিটি ডিলিট হয়ে যাবে এবং ওই ক্যাটাগরির প্রোডাক্টগুলো স্বয়ংক্রিয়ভাবে `General` ক্যাটাগরিতে চলে যাবে।

৪. **হোমপেজে যাচাই করুন:**
   - `http://localhost:5173/` (POS Homepage)-এ যান।
   - লক্ষ্য করুন, ডিলিট করা ক্যাটাগরি কার্ডটি আর নেই এবং আপনার বর্তমান সক্রিয় ক্যাটাগরিগুলো সুন্দরভাবে ফিল্টার হচ্ছে!
