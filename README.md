# Loan Application Form

A modern, type-safe loan application form built with React, TypeScript, and Vite. This application demonstrates best practices in form handling, validation, and state management while maintaining a great user experience.

## 🚀 Tech Stack

- **React 19** - For building the user interface
- **TypeScript** - For type safety and better developer experience
- **Vite** - For fast development and optimized builds
- **React Router v7** - For client-side routing
- **React Hook Form** - For form state management and validation
- **Zod** - For runtime type validation
- **TailwindCSS** - For styling
- **Vitest** - For testing
- **Testing Library** - For component testing

## 🏗 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── FormInput.tsx   # Base form input component
│   ├── Layout.tsx      # Application layout
│   ├── StepGuard.tsx   # Route protection component
│   └── TextField.tsx   # Text input component
├── hooks/             # Custom React hooks
│   └── useLoanForm.ts # Form state management hook
├── lib/               # Utility functions and shared logic
│   └── schemas.ts     # Zod validation schemas
├── pages/             # Page components
│   ├── PersonalInformationStep.tsx
│   ├── ContactDetailsStep.tsx
│   ├── LoanRequestStep.tsx
│   ├── FinancialInformationStep.tsx
│   └── FinalizationStep.tsx
├── services/          # API and external services
│   ├── api.ts         # API client
│   └── __mocks__/     # Test mocks
├── test/             # Test setup and utilities
│   └── setup.ts      # Test environment setup
└── types/            # TypeScript type definitions
    └── loan.ts       # Loan application types
```

## 🎯 Key Features

- **Multi-step Form**: A 5-step loan application process with progress tracking
- **Form Validation**: Comprehensive validation using Zod schemas
- **Type Safety**: Full TypeScript coverage with strict type checking
- **State Persistence**: Form data is saved to localStorage between steps
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Accessibility**: ARIA attributes and semantic HTML throughout
- **Error Handling**: Graceful error handling for API calls and form validation
- **Route Protection**: Prevents skipping steps or accessing invalid routes

## 🛠 Development

### Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- Node.js 23.6.0 (automatically installed via nvm)
- npm 9+

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/loan-application.git
cd loan-application
```

2. Install and use the correct Node.js version:
```bash
nvm install
nvm use
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ui` - Run tests with Vitest UI

## 🧪 Testing

We use Vitest and Testing Library for our tests. The testing strategy includes:

- **Unit Tests**: For utilities and hooks
- **Component Tests**: For UI components
- **Integration Tests**: For form flows and API interactions

Key testing principles:
- Test behavior, not implementation
- Use React Testing Library's queries
- Mock external dependencies
- Test accessibility
- Ensure type safety in tests

Example test:
```typescript
describe('PersonalInformationStep', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<PersonalInformationStep />);
    
    await user.click(screen.getByRole('button', { name: /continue/i }));
    
    expect(screen.getByText('First name is required')).toBeInTheDocument();
  });
});
```

## 🏗 Architecture Decisions

### Form Management
- **Why React Hook Form?** 
  - Better performance than controlled components
  - Built-in form state management
  - Easy integration with Zod for validation
  - Reduces boilerplate code

### State Management
- **Why Custom Hooks?**
  - Encapsulates form logic
  - Reusable across steps
  - Easy to test
  - Maintains type safety

### Validation
- **Why Zod?**
  - Runtime type checking
  - Great TypeScript integration
  - Composable schemas
  - Clear error messages

### Routing
- **Why React Router?**
  - Declarative routing
  - Built-in hooks for navigation
  - Easy to implement protected routes
  - Great developer experience

### Styling
- **Why TailwindCSS?**
  - Utility-first approach
  - No CSS-in-JS runtime overhead
  - Easy to maintain
  - Great developer experience

## 📝 Code Style

We follow these principles:
- Use TypeScript for all new code
- Prefer functional components
- Use React hooks for state and effects
- Follow React Testing Library best practices
- Write self-documenting code
- Keep components small and focused

### Code Formatting

We use Prettier for consistent code formatting. Our configuration includes:

- Single quotes for strings
- Semicolons at the end of statements
- 2 spaces for indentation
- 100 characters line length
- Trailing commas in multiline
- Arrow function parentheses always
- No bracket same line for JSX

To format your code:
```bash
# Format all files
npm run format

# Check if files are formatted correctly
npm run format:check
```

We recommend setting up your editor to:
- Format on save using Prettier
- Use the project's Prettier configuration
- Show formatting errors inline

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Kent C. Dodds](https://kentcdodds.com/) for testing best practices
- [React Hook Form](https://react-hook-form.com/) for form management
- [Vite](https://vitejs.dev/) for the amazing build tool
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
