// original error page: logo, "something went wrong", 5s loading bar after 1s, then redirect home
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogoIcon } from '@/components/ui/icons';
import { site } from '@/content/site';
import './not-found.css';

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push(site.pageLinks.home), 6000); // 1s delay + 5s bar
    return () => clearTimeout(t);
  }, [router]);
  return (
    <main>
      <div className="default mask mask_errorpage">
        <div className="grid-container-error">
          <div className="errorSvgWrapper"><LogoIcon /></div>
          <div className="errorTextWrapper">
            <h1 className="errorTitle">something went wrong</h1>
            <p className="errorText">You will be redirected shortly. Click here to access the <a href={site.pageLinks.home}>homepage</a>.</p>
          </div>
          <div className="loadingBar"><div className="innerLoader" /></div>
        </div>
      </div>
    </main>
  );
}
