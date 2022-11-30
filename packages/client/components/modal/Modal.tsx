import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AppProps {
    title: string;
    size: 'sm' | 'md' | 'lg' | 'xl';
    isShowing: boolean;
    hide: () => void;
    children?: React.ReactNode;
}

export default function Modal({
    title,
    size,
    isShowing,
    hide,
    children,
}: AppProps) {
    return isShowing
        ? createPortal(
              <div
                  className="relative z-10"
                  aria-labelledby="modal-title"
                  role="dialog"
                  aria-modal="true"
              >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                  <div className="fixed inset-0 z-10 overflow-y-auto">
                      <div
                          onClick={hide}
                          className="flex sm:min-w-xl min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 h-full"
                      >
                          <div
                              onClick={(e) => e.stopPropagation()}
                              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-4xl"
                          >
                              <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                      {title}
                                  </h3>
                                  <button
                                      type="button"
                                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                      onClick={hide}
                                  >
                                      <XMarkIcon className="w-5 h-5" />
                                      <span className="sr-only">
                                          Close modal
                                      </span>
                                  </button>
                              </div>
                              {children ? (
                                  children
                              ) : (
                                  <>
                                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                          <div className="sm:flex sm:items-start">
                                              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                  <svg
                                                      className="h-6 w-6 text-red-600"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      strokeWidth="1.5"
                                                      stroke="currentColor"
                                                      aria-hidden="true"
                                                  >
                                                      <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
                                                      />
                                                  </svg>
                                              </div>
                                              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                  <h3
                                                      className="text-lg font-medium leading-6 text-gray-900"
                                                      id="modal-title"
                                                  >
                                                      Deactivate account
                                                  </h3>
                                                  <div className="mt-2">
                                                      <p className="text-sm text-gray-500">
                                                          Are you sure you want
                                                          to deactivate your
                                                          account? All of your
                                                          data will be
                                                          permanently removed.
                                                          This action cannot be
                                                          undone.
                                                      </p>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                          <button
                                              type="button"
                                              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                          >
                                              Deactivate
                                          </button>
                                          <button
                                              type="button"
                                              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                          >
                                              Cancel
                                          </button>
                                      </div>
                                  </>
                              )}
                          </div>
                      </div>
                  </div>
              </div>,
              document.body
          )
        : null;
}
