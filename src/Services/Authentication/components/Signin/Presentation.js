import React from "react";

function Presentation({ state, handleChange, handleSubmit }) {
  return (
    <div>
        <form onSubmit={handleSubmit} className="shadow-2xl p-4 max-w-md mx-auto bg-white border-t-8 border-indigo-700 mt-10 rounded">
          <div className="text-center mt-24">
            <div className="flex items-center justify-center">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                className="w-12 h-12 text-blue-500"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-4xl tracking-tight">Sign in your account</h2>
          </div>
          <label
            className="font-medium block mb-1 mt-6 text-gray-700"
            for="username"
          >
            Email
          </label>
          <input
            className="appearance-none border-2 rounded w-full py-3 px-3 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 pr-16 font-mono"
            name="email"
            value={state.email}
            type="email"
            autocomplete="on"
            autofocus
            onChange={handleChange}
            />

          <label
            className="font-medium block mb-1 mt-6 text-gray-700"
            for="password"
            >
            Password
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 right-0 flex items-center px-2">
              <input
                className="hidden js-password-toggle"
                id="toggle"
                type="checkbox"
                />
              <label
                className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label"
                for="toggle"
                >
                show
              </label>
            </div>
            <input
              onChange={handleChange}
              className="appearance-none border-2 rounded w-full py-3 px-3 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 pr-16 font-mono js-password"
              name="password"
              value={state.password}
              type="password"
              autocomplete="off"
            />
          </div>

          <button
            className="w-full bg-indigo-700 hover:bg-indigo-900 text-white font-medium py-3 px-4 mt-10 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Sign in
          </button>
        </form>
    </div>
  );
}

export default Presentation;

