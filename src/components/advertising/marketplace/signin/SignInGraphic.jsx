import React from 'react';

/**
 * SignInGraphic — the decorative left-side panel showing the brand's
 * sign-in graphic image. The image is object-fitted to fill the container
 * with object-position set so the top-right of the image stays visible.
 */
export default function SignInGraphic() {
  return (
    <div className="si-graphic">
      <img
        className="si-graphic__img"
        src="/advertising/marketplace/sign-in/sign-in graphic.jpg"
        alt="الهمزة المتطورة — للدعاية والإعلان"
      />
    </div>
  );
}
