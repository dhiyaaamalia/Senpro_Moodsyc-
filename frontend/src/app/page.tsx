import Navbar from "@/components/Navbar";
import Result from "@/components/Result";
import TextInputForm from "@/components/form/TextInputForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moodsyc",
  description:
    "Moodsyc is a website that can provide music recommendations that match the sentiment or feelings that the user is feeling via text.",
};
export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between px-24 py-8">
      <Navbar />
      <Result />
      <TextInputForm />
    </main>
  );
}
