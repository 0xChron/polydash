import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";


export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand/About */}
          <div>
            <h3 className="text-white text-2xl mb-3 font-['Fredoka']">
              polydash
            </h3>
            <p className="text-sm text-gray-400">
              free and user-friendly polymarket analytics platform that gives you an edge in prediction markets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">quick links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  dashboard
                </Link>
              </li>
              <li>
                <Link href="/screener" className="hover:text-white transition-colors">
                  market screener
                </Link>
              </li>
              <li>
                <a 
                  href="https://polymarket.com/?via=lakan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  visit polymarket ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-3">contact us</h3>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com/polydash" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <BsTwitterX className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <p className="text-xs text-gray-500 mb-2">
            <strong className="text-gray-400">Disclaimer:</strong> This is an unofficial tool and is not affiliated with Polymarket. 
            All data is sourced from Polymarket's public API. This tool is for informational purposes only and should not be considered financial advice.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 border-t border-gray-800 pt-4">
          <p>© {new Date().getFullYear()} Polydash. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}