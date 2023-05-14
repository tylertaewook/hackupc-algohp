import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { IoSparklesSharp } from 'react-icons/io5'

import axios from 'axios'
import { predictionData } from '../variables/predictionData'

export default function SearchModal() {
  let [isOpen, setIsOpen] = useState(false)
  const [loading, isLoading] = useState(false)
  const [query, setQuery] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [resultVal, setResultVal] = useState<string | undefined>('')

  const apiKey = process.env.OPENAI_API_KEY;
  // alert(apiKey)
  const client = axios.create({
    headers: {
      // Authorization: "Bearer " + apiKey,
      Authorization: "Bearer " + apiKey,
    },
  });

  const params = {
    prompt: predictionData + searchText,
    model: "text-davinci-003",
    max_tokens: 1000,
    temperature: 0,
  };

  function closeModal() {
    setIsOpen(false)
    setQuery(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  // function getRandomValue(): Promise<number> {
  //   return new Promise((resolve) => {
  //     const delay = Math.floor(Math.random() * (5000 - 3000 + 1) + 3000); // Random delay between 3000 and 5000 milliseconds
  //     setTimeout(() => {
  //       const randomValue = Math.floor(Math.random() * 201); // Random value between 0 and 100
  //       resolve(randomValue);
  //     }, delay);
  //   });
  // }

  async function askGPT(): Promise<string> {
    try {
      const result = await client.post("https://api.openai.com/v1/completions", params);
      return result.data.choices[0].text;
    } catch (err) {
      console.log(err);
      throw err; // Rethrow the error to handle it outside of the function if needed
    }
  }

  async function askDummy(): Promise<string> {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("hello world");
      }, 2000);
    });
  }
  

  const handleKeyDown = async (event: { key: string }) => {
    if (event.key === 'Enter') {
      setSearchText('')
      isLoading(true);
      setQuery(true)

      const response = askGPT()
      setResultVal(await response);
      isLoading(false)
    }
  }

  


  return (
    <>
        <button onClick={openModal} className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 hover:bg-navy-900 hover:text-white cursor-pointer">
          <p className="pl-3 pr-2 text-xl">
            <IoSparklesSharp className="h-4 w-4 text-gray-400 " />
          </p>
          <input
            placeholder="Ask me!"
            className="h-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 hover:bg-navy-900 hover:text-white cursor-pointer"
            disabled={true}
          />
        </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <div className="fixed inset-0 bg-black" aria-hidden="true" />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full mx-20 transform overflow-hidden rounded-2xl bg-gray-800 p-3 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    className=""
                  >
                    <div className="flex h-full items-center rounded-md bg-lightPrimary text-navy-700">
                        <p className="">
                            <IoSparklesSharp className="h-4 w-4 mx-3 text-gray-400 dark:text-white" />
                        </p>
                        
                        <input
                            type="text"
                            onKeyDown={handleKeyDown}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            placeholder="Ask me about predicted data!"
                            className="p-5 h-full w-full bg-lightPrimary text-xl font-medium text-navy-700 outline-none placeholder:!text-gray-400"
                        />
                    </div>
                  </Dialog.Title>
                  {query && <div className="flex h-full items-center rounded-md text-lg text-navy-100 p-5">
                    {!loading ? <text className="whitespace-pre-line">&gt;&gt; {resultVal}</text> : <text>Calculating...</text>}
                  </div>}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
