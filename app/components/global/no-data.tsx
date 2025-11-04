import { Inbox } from 'lucide-react';

const NoDataPage = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <Inbox className="h-12 w-12 text-gray-400 mb-4" /> {/* Muted, spacious sizing */}
      <p className="text-gray-800 text-center max-w-md">{text}</p>
    </div>
  );
};

export default NoDataPage;