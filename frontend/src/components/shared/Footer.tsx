import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiSinglestore } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 mt-4 w-full">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <a href="/" className="inline-flex items-center">
            <SiSinglestore className="size-8 text-primary" />
          </a>
          <p className="text-sm leading-5">
            Discover the best products across electronics, fashion, home,
            beauty, sports, and more. Trusted by thousands, with fast delivery
            and unbeatable prices.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-primary">
                Home
              </a>
            </li>
            <li>
              <a href="/search?q=best" className="hover:text-primary">
                Best Sellers
              </a>
            </li>
            <li>
              <a href="/search?q=offers" className="hover:text-primary">
                Offers &amp; Deals
              </a>
            </li>
            <li>
              <a href="/cart" className="hover:text-primary">
                Cart
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-primary">
                My Account
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Need Help?</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-primary">
                Delivery Information
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Return &amp; Refund Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Payment Methods
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Track your Order
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Follow Us</h3>
          <ul className="flex flex-wrap space-x-4 mb-6">
            <li>
              <a href="#" className="hover:text-primary">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                YouTube
              </a>
            </li>
          </ul>

          <div>
            <p className="text-sm mb-2">Subscribe to our newsletter</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm">
          Copyright {new Date().getFullYear()} © All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
