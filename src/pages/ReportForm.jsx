import { useState, useRef } from "react";
import { FiUpload, FiFileText, FiCheckCircle } from "react-icons/fi";
import logo from "../assets/logo/logowhitebg.png";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Input,
  Textarea,
  Button,
  Flex,
  Text,
  Progress,
  useToast,
} from "@chakra-ui/react";
const ReportForm = () => {
  const [topic, setTopic] = useState("");
  const [understanding, setUnderstanding] = useState("");
  const [guidelines, setGuidelines] = useState("");
  const [files, setFiles] = useState([]);
  const [includeImages, setIncludeImages] = useState(false);
  const [referenceCount, setReferenceCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Import baseUrl from environment variables
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleReferenceChange = (e) => {
    const value = parseInt(e.target.value);

    if (isNaN(value)) {
      setReferenceCount(5);
      return;
    }

    if (value > 100) {
      setReferenceCount(100);
      return;
    }

    setReferenceCount(value);
  };

  const incrementReferences = () => {
    if (referenceCount < 100) {
      setReferenceCount((prev) => {
        // Ensure it's a multiple of 5
        const newValue = prev + 5;
        return newValue > 100 ? 100 : newValue;
      });
    }
  };

  const decrementReferences = () => {
    setReferenceCount((prev) => {
      const newValue = prev - 5;
      return newValue < 0 ? 0 : newValue;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare form data
      const payload = {
        topic,
        understanding,
        guidelines,
        includeImages,
        referenceCount,
        files,
      };

      const response = await fetch(`${baseUrl}generation/`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      // Show success message
      toast({
        title: "Report Submitted",
        description: "Your report information has been submitted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setTopic("");
      setUnderstanding("");
      setGuidelines("");
      setFiles([]);
      setIncludeImages(false);
      setReferenceCount(5);
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto px-6 sm:px-10 mt-10 sm:mt-14">
      <div className="w-full flex justify-center items-center">
        <img src={logo} className="h-16 mb-16" />
      </div>
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1a1a8c] border-solid" />
        </div>
      )}

      <div className="border border-[#1a1a8c] rounded-lg">
        <Card className=" rounded-lg overflow-hidden">
          <CardHeader className="bg-[#1a1a8c] text-white py-3 px-4 text-center">
            <Heading size="md">Enter your report information</Heading>
          </CardHeader>

          <CardBody className="p-4">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-[#1a1a8c] font-medium mb-1"
                  >
                    Report Title
                  </label>
                  <Input
                    id="topic"
                    placeholder="Enter the title of your report"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="border-[#1a1a8c] focus:border-[#1a1a8c] focus:ring-[#1a1a8c]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="understanding"
                    className="block text-[#1a1a8c] font-medium mb-1"
                  >
                    Personal Understanding of the Topic
                  </label>
                  <Textarea
                    id="understanding"
                    placeholder="Describe your current understanding of this topic"
                    value={understanding}
                    onChange={(e) => setUnderstanding(e.target.value)}
                    className="min-h-[150px] border-[#1a1a8c] focus:border-[#1a1a8c] focus:ring-[#1a1a8c]"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <input
                    type="checkbox"
                    id="include-images"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="h-4 w-4 rounded border-[#1a1a8c] text-[#1a1a8c] focus:ring-[#1a1a8c]"
                  />
                  <label
                    htmlFor="include-images"
                    className="text-[#1a1a8c] font-medium"
                  >
                    Include images in the report
                  </label>
                </div>

                <div>
                  <label
                    htmlFor="references"
                    className="block text-[#1a1a8c] font-medium mb-1"
                  >
                    Number of References
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="references"
                      type="number"
                      min="5"
                      max="100"
                      step="5"
                      value={referenceCount}
                      onChange={handleReferenceChange}
                      className="border-[#1a1a8c] focus:border-[#1a1a8c] focus:ring-[#1a1a8c]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      colorScheme="blue"
                      onClick={incrementReferences}
                      className="border-[#1a1a8c] text-[#1a1a8c] hover:bg-[#1a1a8c] hover:text-[#1a1a8c]"
                    >
                      +5
                    </Button>
                    <Button
                      type="button"
                      colorScheme="blue"
                      variant="outline"
                      onClick={decrementReferences}
                      className="border-[#1a1a8c] text-[#1a1a8c] hover:bg-[#1a1a8c] hover:text-[#1a1a8c]"
                    >
                      -5
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#1a1a8c] mt-1">
                    <span>Must be a multiple of 5 (max 100)</span>
                    <span>{referenceCount}/100</span>
                  </div>
                  <Progress
                    value={(referenceCount / 100) * 100}
                    size="sm"
                    colorScheme="blue"
                    className="mt-1 rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#1a1a8c] font-medium mb-1">
                    Guidelines for Report
                  </label>
                  <div className="border-2 border-dashed border-[#1a1a8c] rounded-lg p-4 bg-white hover:bg-[#1a1a8c]transition-colors">
                    <Flex alignItems="center" justifyContent="space-between">
                      <Flex alignItems="center">
                        <FiUpload className="h-5 w-5 text-[#1a1a8c] mr-2" />
                        <Box>
                          <Text className="text-sm font-medium text-[#1a1a8c]">
                            Upload guideline documents
                          </Text>
                          <Text className="text-xs text-[#1a1a8c]">
                            Drag and drop files here or click to browse
                          </Text>
                        </Box>
                      </Flex>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <Button
                        type="button"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-[#1a1a8c] text-[#1a1a8c] hover:bg-[#1a1a8c] hover:text-[#1a1a8c]"
                      >
                        Select Files
                      </Button>
                    </Flex>
                  </div>

                  {files.length > 0 && (
                    <div className="bg-[#1a1a8c]p-3 rounded-md mt-2 max-h-[150px] overflow-y-auto">
                      <p className="text-sm font-medium text-[#1a1a8c] mb-1">
                        Selected files:
                      </p>
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-[#1a1a8c]"
                          >
                            <FiFileText className="h-4 w-4 mr-2" />
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Textarea
                    id="guidelines"
                    placeholder="Type additional guidelines or instructions for your report"
                    value={guidelines}
                    onChange={(e) => setGuidelines(e.target.value)}
                    className="min-h-[150px] mt-2 border-[#1a1a8c] focus:border-[#1a1a8c] focus:ring-[#1a1a8c]"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Submitting..."
                    className="w-full bg-[#1a1a8c] hover:bg-[#1a1a8c] text-white py-2 rounded-lg"
                  >
                    Submit Report Information
                  </button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ReportForm;
