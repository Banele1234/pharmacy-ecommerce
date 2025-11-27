import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

export const createAdminUser = async () => {
  const adminEmail = "admin@pharmacare.com"; // Change to your preferred email
  const adminPassword = "Admin123!"; // Change to a strong password
  
  try {
    console.log("🔄 Creating admin user...");
    
    // 1. Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      adminEmail, 
      adminPassword
    );
    const userId = userCredential.user.uid;
    
    console.log("✅ Auth user created with UID:", userId);

    // 2. Create user document in Firestore with admin role
    await setDoc(doc(db, "users", userId), {
      uid: userId,
      email: adminEmail,
      displayName: "Administrator",
      role: "admin", // This is the key - set role to "admin"
      createdAt: new Date(),
      isActive: true,
      phone: "",
      emailVerified: false
    });
    
    console.log("✅ Firestore document created with admin role");
    console.log("🎉 Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("🆔 UID:", userId);
    
    return { success: true, email: adminEmail, password: adminPassword };
    
  } catch (error: any) {
    console.error("❌ Error creating admin:", error.message);
    return { success: false, error: error.message };
  }
};