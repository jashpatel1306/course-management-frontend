import React, { cloneElement } from "react";
import { Container } from "components/shared";
import { Card } from "components/ui";
import Logo from "components/template/Logo";

const Layout = ({ children, content, ...rest }) => {
    return (
        <div className="h-full relative z-0 after:content-[''] after:h-1/2 after:w-full after:absolute after:bottom-0 after:-z-10 after:bg-[#4D4D29] before:content-[''] before:h-1/2 before:w-full before:absolute before:top-0 before:-z-10 before:bg-[#F6F6F6]">
            <Container className="flex flex-col flex-auto items-center justify-center min-w-0 h-full">
                <Card
                    className="min-w-[320px] md:min-w-[450px]"
                    bodyClass="p-0 md:p-5"
                >
                    <div className="bg-[#4D4D2917] p-5 rounded-lg">
                        <div className="text-center">
                            <Logo type="streamline" imgClass="mx-auto" />
                        </div>
                        <div className="text-center">
                            {content}
                            {children
                                ? cloneElement(children, {
                                      contentClassName: "text-center",
                                      ...rest,
                                  })
                                : null}
                        </div>
                    </div>
                </Card>
            </Container>
        </div>
    );
};

export default Layout;
