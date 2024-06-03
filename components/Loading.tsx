import { Dictionary } from "@/app/dictionaries";
import { useLoading } from "@/context/LoadingContext";
import { TailSpin } from "react-loader-spinner";

type Props = {
  dictionary: Dictionary;
};

export const Loading = ({ dictionary }: Props) => {
  const { loading } = useLoading();

  if (!loading) {
    return null;
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <TailSpin
          visible={true}
          height="120"
          width="120"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass="loader"
        />
        <h2 className="mt-2">{dictionary.processing}</h2>
      </div>
    </div>
  );
};
