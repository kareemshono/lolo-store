import styles from "./page.module.scss"
import { Inter } from "next/font/google";
import Navbar from "../../components/adminDashboard/navbar/Navbar";
import Sidebar from "@/app/components/adminDashboard/sidebar/Sidebar";

export const metadata = {
  title: "Admin Dashboard",
};
const inter = Inter({subsets:["latin"], weight:["100","200","300","400","500","600","700","800","900"]})

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
        <body className={`${inter.className} ${styles.body}`}>
                <div className={styles.adminPageContainer}>
                  <div className={styles.colPageRight}>
                     <Navbar />

   
                   <main className="p-6 overflow-y-auto flex-1">{children}</main>
                  </div>
                <div className={styles.colPageLeft}>
                  <Sidebar />
                </div>
                </div>
    
        </body>
    </html>

  );
}
