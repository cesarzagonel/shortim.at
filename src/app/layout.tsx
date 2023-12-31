import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Box } from "@chakra-ui/react";
import currentUser from "@/helpers/currentUser";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "shortim.at",
  description: "Free short URLs",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <html lang="en" style={{ height: "100%" }}>
      <body
        className={inter.className}
        style={{ height: "100%", display: "flex" }}
      >
        <Providers>
          <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
            <Navbar user={user} />

            <Box
              display={"flex"}
              flexDir={"column"}
              flexGrow={1}
              overflowX={"auto"}
            >
              {children}
              <Box backgroundColor={"white"}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  h={"50px"}
                  borderTop={"solid 1px"}
                  borderColor={"gray.200"}
                >
                  <Box>
                    Built with{" "}
                    <a href="https://chakra-ui.com/" target="_blank">
                      Chakra UI
                    </a>{" "}
                    and{" "}
                    <a href="https://chakra-templates.dev/" target="_blank">
                      chakra-templates.dev
                    </a>{" "}
                    -{" "}
                    <Link
                      href="https://github.com/cesarzagonel/shortim.at"
                      target="_blank"
                      style={{ display: "inline-block" }}
                    >
                      <Image
                        style={{ position: "relative", top: 4 }}
                        src="/github.svg"
                        alt="GitHub"
                        width={20}
                        height={20}
                      />
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
