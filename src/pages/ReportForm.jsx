import { useState, useRef } from "react";
import { FiUpload, FiFileText, FiCheckCircle } from "react-icons/fi";
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
  const [referenceCount, setReferenceCount] = useState(5);
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
    if (referenceCount > 5) {
      setReferenceCount((prev) => {
        // Ensure it's a multiple of 5
        const newValue = prev - 5;
        return newValue < 5 ? 5 : newValue;
      });
    }
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
        files
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
    <div className="w-full mx-auto px-6 sm:px-10 mt-10 sm:mt-14">{isSubmitting && (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 border-solid" />
      </div>
    )}
    
      <div className="justify-center flex items-center"> </div>
      <Card className="border border-green-200 shadow-md rounded-lg overflow-hidden">
        <CardHeader className="bg-green-600 text-white py-3 px-4 text-center">
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
                  className="block text-green-700 font-medium mb-1"
                >
                  Topic
                </label>
                <Input
                  id="topic"
                  placeholder="Enter the main topic of your report"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="understanding"
                  className="block text-green-700 font-medium mb-1"
                >
                  Personal Understanding of the Topic
                </label>
                <Textarea
                  id="understanding"
                  placeholder="Describe your current understanding of this topic"
                  value={understanding}
                  onChange={(e) => setUnderstanding(e.target.value)}
                  className="min-h-[150px] border-green-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id="include-images"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500"
                />
                <label
                  htmlFor="include-images"
                  className="text-green-700 font-medium"
                >
                  Include images in the report
                </label>
              </div>

              <div>
                <label
                  htmlFor="references"
                  className="block text-green-700 font-medium mb-1"
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
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <Button
                    type="button"
                    colorScheme="green"
                    variant="outline"
                    onClick={incrementReferences}
                    className="border-green-400 text-green-700 hover:bg-green-200 hover:text-green-800"
                  >
                    +5
                  </Button>
                  <Button
                    type="button"
                    colorScheme="green"
                    variant="outline"
                    onClick={decrementReferences}
                    className="border-green-400 text-green-700 hover:bg-green-200 hover:text-green-800"
                  >
                    -5
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm text-green-600 mt-1">
                  <span>Must be a multiple of 5 (max 100)</span>
                  <span>{referenceCount}/100</span>
                </div>
                <Progress
                  value={(referenceCount / 100) * 100}
                  size="sm"
                  colorScheme="green"
                  className="mt-1 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-green-700 font-medium mb-1">
                  Guidelines for Report
                </label>
                <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-white hover:bg-green-50 transition-colors">
                  <Flex alignItems="center" justifyContent="space-between">
                    <Flex alignItems="center">
                      <FiUpload className="h-5 w-5 text-green-600 mr-2" />
                      <Box>
                        <Text className="text-sm font-medium text-green-700">
                          Upload guideline documents
                        </Text>
                        <Text className="text-xs text-green-600">
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
                      colorScheme="green"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-green-400 text-green-700 hover:bg-green-200 hover:text-green-800"
                    >
                      Select Files
                    </Button>
                  </Flex>
                </div>

                {files.length > 0 && (
                  <div className="bg-green-50 p-3 rounded-md mt-2 max-h-[150px] overflow-y-auto">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Selected files:
                    </p>
                    <ul className="space-y-1">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-green-700"
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
                  className="min-h-[150px] mt-2 border-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="mt-4">
                <Button
                  type="submit"
                  colorScheme="green"
                  isLoading={isSubmitting}
                  loadingText="Submitting..."
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Report Information
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ReportForm;
