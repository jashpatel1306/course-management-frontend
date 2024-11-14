import React from "react";
import { Container, DoubleSidedImage } from "components/shared";

const ExpiredLink = () => {
  return (
    <Container className="h-full">
      <div className="h-full flex flex-col items-center justify-center">
        <DoubleSidedImage
          src="/img/others/img-2.png"
          darkModeSrc="/img/others/img-2-dark.png"
          alt="Access Denied!"
        />
        <div className="mt-6 text-center">
          <h3 className="mb-2">Expired Link!</h3>
          <p className="text-base">
            This link has expired. Please contect the owner of this link to get
            a new one.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default ExpiredLink;
